<script setup>
import { reactive, ref } from 'vue';
import Row from '/@/components/Row.vue';
import Block from '/@/components/Block.vue';
import BlockFooter from '/@/components/BlockFooter.vue';
import { GetGuilds } from '/@/discord/api/calls';
import { SavePoll, GetMutualGuilds, GetAllRoles, GetAllMembers, GetAllTextChannels, GetPollChannels, GetPollAvailableChanges } from '/@/api/calls';
import { SelectedGuildCache } from '/@/helpers/cache';

const poll = reactive({
  id:                             0,
  question:                       '',
  channel_id:                     '',
  result_channel_id:              '',
  pin:                            false,
  mention_role:                   false,
  delete_after_results:           false,
  custom:                         true,
  role_id_needed:                 '',
  vote_percentage_needed_to_pass: 50,
  max_votes_per_user:             1,
  options:                        ref([])
});

function getEmptyChange() {
  return {
      identifier: '',
      key: '',
      value: '',
    };
}

function addDefaultOptions() {
  poll.options.push(reactive({"positive": true, "value": "Yes", "changes": ref([getEmptyChange()])}));
  poll.options.push(reactive({"positive": false, "value": "No", "changes": ref([getEmptyChange()])}));
}

class PollHelper {
  static validate(poll) {
    let errors = [];
    if (poll.question === '') {
      errors.push("Question can't be empty.");
    }
    if (poll.channel_id === '' || poll.channel_id === null) {
      errors.push("Channel can't be empty.")
    }
    return errors;
  }

  static sanitize(poll) {
    let newPoll = JSON.parse(JSON.stringify(poll));

    if (newPoll.channel_id === '') {
      newPoll.channel_id = null;
    }
    if (newPoll.result_channel_id === '') {
      newPoll.result_channel_id = newPoll.channel_id;
    }
    if (newPoll.role_id_needed === '') {
      newPoll.role_id_needed = null;
    }

    return newPoll;
  }
}

function save() {
  let errors = PollHelper.validate(poll);
  if (errors.length > 0) {
    console.log(errors);
  } else {
    new SavePoll(PollHelper.sanitize(poll)).call().then((response) => {
      console.log('GOOD', response);
    }).catch((error) => {
      console.log('BAD', error);
    });
  }
}

addDefaultOptions();
let selectedGuild = SelectedGuildCache.get();

let availableChannels = reactive([]);
let availableRoles    = reactive([]);

let pollChannelsCalled = false;
if (!pollChannelsCalled) {
  new GetPollChannels(selectedGuild).call().then((response) => {
    for (let channel of response) {
      availableChannels.push(channel);
    }
    pollChannelsCalled = true;
  })
}

function lockButton() {
  poll.custom = !poll.custom;
  if (!poll.custom) {
    poll.options = ref([]);
    addDefaultOptions();
  }
}

let availableChangesMapping = {};
let availableChanges       = reactive([]);
let availableChangesCalled = false;
if (!availableChangesCalled) {
  new GetPollAvailableChanges().call().then((response) => {
    for (let change of response) {
      availableChanges.push(change);
      availableChangesMapping[change.identifier.value] = change;
    }
  })
}

let allTextChannels       = reactive([]);
let allTextChannelsCalled = false;
if (!allTextChannelsCalled) {
  new GetAllTextChannels(selectedGuild).call().then((response) => {
    for (let channel of response) {
      allTextChannels.push(channel);
    }
  })
}

let allRoles       = reactive([]);
let allRolesCalled = false;
if (!allRolesCalled) {
  new GetAllRoles(selectedGuild).call().then((response) => {
    for (let role of response) {
      allRoles.push(role);
    }
  })
}

let allMembers       = reactive([]);
let allMembersCalled = false;
if (!allMembersCalled) {
  new GetAllMembers(selectedGuild).call().then((response) => {
    for (let member of response) {
      allMembers.push(member);
    }
  })
}


</script>

<template>
  <Block title="Basic settings" subtitle="Basic poll settings">
    <Row label="Question">
      <input id="anarchy-form" type="text" v-model="poll.question" class="form-control" placeholder="Enter question..." required/>
    </Row>
    <Row label="Options">
      <table id="anarchy-table">
        <thead>
          <tr>
            <td style="width:100%;"></td>
            <td></td>
            <td>
              <a class="btn btn-sm" id="anarchy-button-green" style="float:right;" @click="poll.options.push({'positive': false, 'value': ''})" v-if="poll.custom">
                  <i class="fas fa-plus" aria-hidden="true"/>
              </a>
            </td>
          </tr>
        </thead>
        <tr v-for="(option,index) in poll.options" v-bind:key="index">
          <td>
            <input type="text" :disabled="!poll.custom" v-model="poll.options[index].value" id="anarchy-form" class="form-control" placeholder="Enter option..."/>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" :data-bs-target="'#optionSettings' + index" id="anarchy-button-blue" style="float:right;">
              <i class="fas fa-cog" aria-hidden="true"></i>
            </button>
            <div class="modal fade" :id="'optionSettings' + index" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="optionSettingsLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" id="anarchy-modal-content">
                  <div class="modal-body" id="anarchy-modal-body">
                    <label id="anarchy-label">Change connected to option '{{poll.options[index].value}}'</label>
                    <hr class="my-2" id="anarchy-form-row-seperator"/>
                    <div class="row" id="anarchy-form-row" v-for="(change,change_index) in poll.options[index].changes" v-bind:key="change_index">
                      <div class="col-sm-4">
                        <select id="anarchy-form-select" v-model="change.identifier" class="form-select" required>
                          <option disabled value>---Select a change---</option>
                          <option v-for="available_change in availableChanges" :value="available_change.identifier.value" v-bind:key="available_change.identifier.value">
                            {{available_change.identifier.name}}
                          </option>
                        </select>
                      </div>
                      <div class="col-sm-4">
                        <label v-if="change.identifier === ''"></label>
                        <input id="anarchy-form" type="text" v-else-if="availableChangesMapping[change.identifier].key_kind === 'String'" class="form-control"/>
                        <select v-else-if="availableChangesMapping[change.identifier].key_kind === 'Channel'" id="anarchy-form-select" v-model="change.key" class="form-select" required>
                          <option disabled value>---Select a channel---</option>
                          <option v-for="channel in allTextChannels" :value="channel['id']" v-bind:key="channel['id']">
                            #{{channel['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].key_kind === 'Role'" id="anarchy-form-select" v-model="change.key" class="form-select" required>
                          <option disabled value>---Select a role---</option>
                          <option v-for="role in allRoles" :value="role['id']" v-bind:key="role['id']">
                            {{role['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].key_kind === 'Member'" id="anarchy-form-select" v-model="change.key" class="form-select" required>
                          <option disabled value>---Select a member---</option>
                        </select>
                      </div>
                      <div class="col-sm-4">
                        <label v-if="change.identifier === ''"></label>
                        <input id="anarchy-form" type="text" v-else-if="availableChangesMapping[change.identifier].value_kind === 'String'" class="form-control"/>
                        <select v-else-if="availableChangesMapping[change.identifier].value_kind === 'Channel'" id="anarchy-form-select" v-model="change.value" class="form-select" required>
                          <option disabled value>---Select a channel---</option>
                          <option v-for="channel in allTextChannels" :value="channel['id']" v-bind:key="channel['id']">
                            #{{channel['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].value_kind === 'Role'" id="anarchy-form-select" v-model="change.value" class="form-select" required>
                          <option disabled value>---Select a role---</option>
                          <option v-for="role in allRoles" :value="role['id']" v-bind:key="role['id']">
                            {{role['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].value_kind === 'Member'" id="anarchy-form-select" v-model="change.value" class="form-select" required>
                          <option disabled value>---Select a member---</option>
                          <option v-for="member in allMembers" :value="member['id']" v-bind:key="member['id']">
                            {{member['username'] + '#' + member['discriminator']}}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer" id="anarchy-modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <button class="btn btn-outline-danger btn-sm" style="float:right;" :disabled="index < 2"  @click="poll.options.splice(index, 1)" v-if="poll.custom">
              <i class="fas fa-minus" aria-hidden="true"></i>
            </button>
          </td>
        </tr>
      </table>
    </Row>
    <Row label="Channel">
      <select id="anarchy-form-select" v-model="poll.channel_id" class="form-select" required>
        <option disabled value>---Select a channel---</option>
        <option v-for="channel in availableChannels" :value="channel['id']" v-bind:key="channel['id']">
          #{{channel['name']}}
        </option>
      </select>
    </Row>
    <Row label="Result channel" explanation="What channel the results will be posted in">
      <select id="anarchy-form-select" v-model="poll.result_channel_id" class="form-select" required>
        <option disabled value>---Select a channel---</option>
        <option v-for="channel in availableChannels" :value="channel['id']" v-bind:key="channel['id']">
          #{{channel['name']}}
        </option>
      </select>
    </Row>
    <BlockFooter>
      <button class="btn btn-sm" style="float:right;" id="anarchy-button-green" @click="save();">
        Save
      </button>
    </BlockFooter>
  </Block>
  <Block title="Additional settings" subtitle="Extra settings to help personalize your poll.">
    <Row label="Pin?">
      <label class="switch">
        <input type="checkbox" v-model="poll.pin"/>
        <span class="slider"></span>
      </label>
    </Row>
    <Row label="Delete after?">
      <label class="switch">
        <input type="checkbox" v-model="poll.delete_after_results"/>
        <span class="slider"></span>
      </label>
    </Row>
    <Row label="Mention role?">
      <label class="switch">
        <input type="checkbox" v-model="poll.mention_role"/>
        <span class="slider"></span>
      </label>
    </Row>
    <Row label="Max votes per user">
      <select id="anarchy-form-select" v-model="poll.max_votes_per_user" class="form-select" required>
        <option v-for="amount in poll.options.length-1" :value="amount" v-bind:key="amount">
          {{amount}}
        </option>
      </select>
    </Row>
    <Row label="Percentage needed to pass">
      <input id="anarchy-form" type="text" :disabled="poll.custom" v-model="poll.vote_percentage_needed_to_pass" class="form-control" required/>
    </Row>
    <Row label="Role required to vote">
      <select id="anarchy-form-select" v-model="poll.role_id_needed" class="form-select" required>
        <option disabled value>---Select a role---</option>
        <option v-for="role in availableRoles" :value="role['id']" v-bind:key="role['id']">
          {{role['name']}}
        </option>
      </select>
    </Row>
    <BlockFooter>
      <button class="btn btn-sm" style="float:right;" id="anarchy-button-green" @click="save();">
        Save
      </button>
    </BlockFooter>
  </Block>
</template>

<style lang="scss">
  @import "/@/scss/slider.scss";
</style>