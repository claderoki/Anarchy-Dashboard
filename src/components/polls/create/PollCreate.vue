<script setup>
import { reactive, ref } from 'vue';
import { SavePoll, GetAllRoles, GetPollSettings, GetAllMembers, GetAllTextChannels, GetPollAvailableChanges } from '/@/api/calls';
import { SelectedGuildCache } from '/@/helpers/cache';

const poll = reactive({
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

function createOption(value, positive) {
  return reactive({
    "value": value,
    "color": "#000000",
    "changes": ref([getEmptyChange()])
  });
}

function addDefaultOptions() {
  let yesOption = createOption("Yes");
  let noOption = createOption("No");

  yesOption.color = '#5ab070';
  noOption.color  = '#dd8282';
  
  poll.options.push(yesOption);
  poll.options.push(noOption);
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

function lockButton() {
  poll.custom = !poll.custom;
  if (!poll.custom) {
    poll.options = ref([]);
    addDefaultOptions();
  }
}

addDefaultOptions();

let settings                = reactive({allowedChannels: [], allowedChanges: []});
let selectedGuild           = SelectedGuildCache.get();
let availableChangesMapping = {};
let availableChanges        = reactive([]);
let availableChannels       = reactive([]);
let allMembers              = reactive([]);
let allRoles                = reactive([]);
let allTextChannels         = reactive([]);

function hydrateData() {
  new GetPollAvailableChanges().call().then((response) => {
    for (let change of response) {
      availableChanges.push(change);
      availableChangesMapping[change.identifier.value] = change;
    }
  });

  new GetPollSettings(selectedGuild).call().then((response) => {
    for (let channel of response.allowed_channels) {
        settings.allowedChannels.push(channel);
    }
    for (let change of response.allowed_changes) {
        settings.allowedChanges.push(change);
    }
  });

  new GetAllTextChannels(selectedGuild).call().then((response) => {
    for (let channel of response) {
      allTextChannels.push(channel);
    }
  });

  new GetAllRoles(selectedGuild).call().then((response) => {
    for (let role of response) {
      if (role.name !== "@everyone") {
        allRoles.push(role);
      }
    }
  });

  new GetAllMembers(selectedGuild).call().then((response) => {
    for (let member of response) {
      allMembers.push(member);
    }
  });
}

hydrateData();

</script>

<template>
  <anarchy-block title="Basic settings" subtitle="Basic poll settings">
    <anarchy-row label="Question">
      <input type="text" v-model="poll.question" class="form-control" placeholder="Enter question..." required/>
    </anarchy-row>
    <anarchy-row label="Options">
      <table id="anarchy-table">
        <thead>
          <tr>
            <td style="width:100%;"></td>
            <td></td>
            <td>
              <a class="btn btn-outline-success btn-sm" style="float:right;" @click="poll.options.push({'positive': false, 'value': '', 'changes': ref([getEmptyChange()])})" v-if="poll.custom">
                  <i class="fas fa-plus" aria-hidden="true"/>
              </a>
            </td>
          </tr>
        </thead>
        <tr v-for="(option,index) in poll.options" v-bind:key="index">
          <td>
            <div :style="'border-left: 2px solid ' + poll.options[index].color">
              <input type="text" :disabled="!poll.custom" v-model="poll.options[index].value" class="form-control" placeholder="Enter option..."/>
            </div>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" :data-bs-target="'#optionSettings' + index" style="float:right;">
              <i class="fas fa-cog" aria-hidden="true"></i>
            </button>
            <div class="modal fade" :id="'optionSettings' + index" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-body"   id="anarchy-modal-body">
                    <label>Settings for option '{{poll.options[index].value}}'</label>
                    <anarchy-row label="Color">
                      <input type="color" class="form-control form-control-sm form-control-color" v-model="poll.options[index].color">
                    </anarchy-row>
                    <hr class="my-2"/>
                    <label>Change(s)</label>
                    <div class="row" id="anarchy-form-row" v-for="(change,change_index) in poll.options[index].changes" v-bind:key="change_index">
                      <div class="col-sm-4">
                        <select v-model="change.identifier" @change="change.key = ''; change.value = ''" class="form-select" required>
                          <option disabled value>---Select a change---</option>
                          <template v-for="available_change in availableChanges" v-bind:key="available_change.identifier.value">
                            <option :value="available_change.identifier.value" v-if="settings.allowedChanges.includes(available_change.identifier.value)">
                              {{available_change.identifier.name}}
                            </option>
                          </template>
                        </select>
                      </div>
                      <div class="col-sm-4">
                        <label v-if="change.identifier === ''"></label>
                        <input type="text" v-else-if="availableChangesMapping[change.identifier].key_kind === 'String'" class="form-control"/>
                        <select v-else-if="availableChangesMapping[change.identifier].key_kind === 'Channel'" v-model="change.key" class="form-select" required>
                          <option disabled value>---Select a channel---</option>
                          <option v-for="channel in allTextChannels" :value="channel['id']" v-bind:key="channel['id']">
                            #{{channel['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].key_kind === 'Role'" v-model="change.key" class="form-select" required>
                          <option disabled value>---Select a role---</option>
                          <option v-for="role in allRoles" :value="role['id']" v-bind:key="role['id']">
                            {{role['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].key_kind === 'Member'" v-model="change.key" class="form-select" required>
                          <option disabled value>---Select a member---</option>
                        </select>
                      </div>
                      <div class="col-sm-4">
                        <label v-if="change.identifier === ''"></label>
                        <input type="text" v-else-if="availableChangesMapping[change.identifier].value_kind === 'String'" class="form-control"  />
                        <select v-else-if="availableChangesMapping[change.identifier].value_kind === 'Channel'" v-model="change.value" class="form-select" required>
                          <option disabled value>---Select a channel---</option>
                          <option v-for="channel in allTextChannels" :value="channel['id']" v-bind:key="channel['id']">
                            #{{channel['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].value_kind === 'Role'" v-model="change.value" class="form-select" required>
                          <option disabled value>---Select a role---</option>
                          <option v-for="role in allRoles" :value="role['id']" v-bind:key="role['id']">
                            {{role['name']}}
                          </option>
                        </select>
                        <select v-else-if="availableChangesMapping[change.identifier].value_kind === 'Member'" v-model="change.value" class="form-select" required>
                          <option disabled value>---Select a member---</option>
                          <option v-for="member in allMembers" :value="member['id']" v-bind:key="member['id']">
                            {{member['username'] + '#' + member['discriminator']}}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer" id="anarchy-modal-footer">
                    <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">
                      <i class="fas fa-check" aria-hidden="true"></i>
                    </button>
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
    </anarchy-row>
    <anarchy-row label="Channel">
      <select v-model="poll.channel_id" class="form-select" required>
        <option disabled value>---Select a channel---</option>
        <option v-for="channel in availableChannels" :value="channel['id']" v-bind:key="channel['id']">
          #{{channel['name']}}
        </option>
      </select>
    </anarchy-row>
    <anarchy-row label="Result channel" explanation="What channel the results will be posted in">
      <select v-model="poll.result_channel_id" class="form-select"   required>
        <option disabled value>---Select a channel---</option>
        <option v-for="channel in availableChannels" :value="channel['id']" v-bind:key="channel['id']">
          #{{channel['name']}}
        </option>
      </select>
    </anarchy-row>
    <anarchy-block-footer>
      <button class="btn btn-outline-success btn-sm" style="float:right;" @click="save();">
        <i class="fas fa-save" aria-hidden="true"/>
      </button>
    </anarchy-block-footer>
  </anarchy-block>
  <anarchy-block title="Additional settings" subtitle="Extra settings to help personalize your poll.">
    <anarchy-row label="Pin?">
      <div class="form-check form-switch">
        <input class="form-check-input" v-model="poll.pin" type="checkbox">
      </div>
    </anarchy-row>
    <anarchy-row label="Delete after?">
      <div class="form-check form-switch">
        <input class="form-check-input" v-model="poll.delete_after_results" type="checkbox">
      </div>
    </anarchy-row>
    <anarchy-row label="Mention role?">
      <div class="form-check form-switch">
        <input class="form-check-input" v-model="poll.mention_role" type="checkbox">
      </div>
    </anarchy-row>
    <anarchy-row label="Max votes per user">
      <select v-model="poll.max_votes_per_user" class="form-select" required>
        <option v-for="amount in poll.options.length-1" :value="amount" v-bind:key="amount">
          {{amount}}
        </option>
      </select>
    </anarchy-row>
    <anarchy-row label="Percentage needed to pass">
      <input type="text" :disabled="poll.custom" v-model="poll.vote_percentage_needed_to_pass" class="form-control" required/>
    </anarchy-row>
    <anarchy-row label="Role required to vote">
      <select v-model="poll.role_id_needed" class="form-select" required>
        <option disabled value>---Select a role---</option>
        <option v-for="role in allRoles" :value="role['id']" v-bind:key="role['id']">
          {{role['name']}}
        </option>
      </select>
    </anarchy-row>
    <anarchy-block-footer>
      <button class="btn btn-outline-success btn-sm" style="float:right;" @click="save();">
        <i class="fas fa-save" aria-hidden="true"/>
      </button>
    </anarchy-block-footer>
  </anarchy-block>
</template>
