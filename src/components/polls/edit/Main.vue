<script setup>
import { reactive, ref } from 'vue';
import Row from '../../Row.vue';
import Block from '../../Block.vue';

const poll = reactive({
  id:                             0,
  question:                       '',
  channel_id:                     '',
  result_channel_id:              '',
  pin:                            false,
  mention_role:                   false,
  delete_after_results:           false,
  custom:                         false,
  role_id_needed:                 '',
  vote_percentage_needed_to_pass: 50,
  max_votes_per_user:             1,
  options:                        ref([])
});

function addDefaultOptions() {
  poll.options.push(reactive({"positive": true, "value": "Yes"}));
  poll.options.push(reactive({"positive": false, "value": "No"}));
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
  console.log(PollHelper.sanitize(poll));
  let errors = PollHelper.validate(poll);
  if (errors.length > 0) {
    console.log(errors);
  } else {
    fetch('http://127.0.0.1:8080/api/polls/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(PollHelper.sanitize(poll))
    }).then((temperature) => {
      console.log('GOOD', temperature);
    }).catch((reason) => {
      console.log('BAD', reason);
    });
  }
}

addDefaultOptions();

function getAvailableChannels() {
  return [
    {"id": 1, "name": "general"},
    {"id": 2, "name": "bot-spam"},
  ]
}
function getAvailableRoles() {
  return [
    {"id": 1, "name": "5k+"},
    {"id": 2, "name": "Earthling"},
  ]
}
function lockButton() {
  poll.custom = !poll.custom;
  if (!poll.custom) {
    poll.options = ref([]);
    addDefaultOptions();
  }
}

let availableChannels = getAvailableChannels();
let availableRoles    = getAvailableRoles();

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
            <td style="width:100%;">
              <a class="btn btn-sm" id="anarchy-button-green" style="float:left;" @click="lockButton();">
                  <i class="fas" :class="poll.custom ? 'fa-lock': 'fa-unlock'" aria-hidden="true"></i>
              </a>
            </td>
            <td>
              <a class="btn btn-sm" id="anarchy-button-green" style="float:right;" @click="poll.options.push({'positive': false, 'value': ''})" v-if="poll.custom">
                  <i class="fas fa-plus" aria-hidden="true"></i>
              </a>
            </td>
          </tr>
        </thead>
        <tr v-for="(option,index) in poll.options">
          <td>
            <input type="text" :disabled="!poll.custom" v-model="poll.options[index].value" id="anarchy-form" class="form-control" placeholder="Enter option..."/>
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
        <option v-for="channel in availableChannels" :value="channel['id']">
          #{{channel['name']}}
        </option>
      </select>
    </Row>
    <Row label="Result channel" explanation="What channel the results will be posted in">
      <select id="anarchy-form-select" v-model="poll.result_channel_id" class="form-select" required>
        <option disabled value>---Select a channel---</option>
        <option v-for="channel in availableChannels" :value="channel['id']">
          #{{channel['name']}}
        </option>
      </select>
    </Row>
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
        <option v-for="amount in poll.options.length-1" :value="amount">
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
        <option v-for="role in availableRoles" :value="role['id']">
          {{role['name']}}
        </option>
      </select>
    </Row>
    <button class="btn btn-success" @click="save();">
      Save
    </button>
  </Block>
</template>

<style lang="scss">
  @import "./../../../scss/slider.scss";
</style>