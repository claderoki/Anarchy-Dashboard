<script setup>

import { ref, reactive } from 'vue';
import { GetAllTextChannels, GetPollSettings, GetPollAvailableChanges } from '/@/api/calls';
import { SelectedGuildCache } from '/@/helpers/cache';

let settings = reactive({
    allowedChannels: [],
    allowedChanges: [],
});

let selectedGuild     = SelectedGuildCache.get();
let availableChannels = reactive([]);
let availableChanges  = reactive([]);

class Pagination {
  constructor() {
    this.pages           = [];
    this.currentPage     = 0;
  }

  addPage(page) {
    this.pages.push(page);
  }

  static splitPages(totalItems, maxItemsPerPage) {
    let index = 0;
    let pages = [];
    let pageCount = Math.ceil(totalItems.length / maxItemsPerPage);

    for (let i = 0; i < pageCount; i++) {

      let itemCount;
      if (pageCount == i+1) {
        itemCount = (totalItems.length % maxItemsPerPage);
        if (itemCount === 0) {
          itemCount = maxItemsPerPage;
        }
      } else {
        itemCount = maxItemsPerPage;
      }

      let items = Array.from(totalItems.slice(index, index + itemCount));
      index += itemCount;
      pages.push(new Page(items));
    }

    return pages;
  }

}

class Page {
  constructor(items) {
    this.items = items;
  }
}

let paginations = reactive({
  changes: new Pagination(),
  channels: new Pagination(),
});

function hydrateData() {
  new GetPollSettings(selectedGuild).call().then((response) => {
    for (let channel of response.allowed_channels) {
        settings.allowedChannels.push(channel)
    }
    for (let change of response.allowed_changes) {
        settings.allowedChanges.push(change)
    }
  });

  new GetPollAvailableChanges().call().then((response) => {
    for (let change of response) {
      availableChanges.push(change);
    }

    for (let page of Pagination.splitPages(availableChanges, 4)) {
      paginations.changes.addPage(page);
    }
  });

  new GetAllTextChannels(selectedGuild).call().then((response) => {
    for (let channel of response) {
      availableChannels.push(channel);
    }
    availableChannels.reverse();

    for (let page of Pagination.splitPages(availableChannels, 4)) {
      paginations.channels.addPage(page);
    }
  });
}

hydrateData();

function getHeightStyle(length, maxItemsPerPage, pxPerItem) {
  let height = (Math.min(length, maxItemsPerPage) * pxPerItem);
  return ('height:'+height+'px;');
}

function onSettingCheck(checked, array, value) {
  if (checked === 'on') {
    array.push(value);
  } else {
    array.remove(value);
  }
}

</script>

<template>
  <anarchy-block title="Poll settings" subtitle="Manage server wide poll configuration.">
    <anarchy-row label="Allowed channels">
      <div v-if="paginations.channels.pages.length > 0" :style="(paginations.channels.pages.length > 1 ? (getHeightStyle(availableChannels.length, 4, 40)) : '')+'position: relative;'">
        <div class="form-check" v-for="(item, index) in paginations.channels.pages[paginations.channels.currentPage].items" v-bind:key="index">
          <div class="form-check form-switch" id="anarchy-switch">
            <input class="form-check-input" :checked="settings.allowedChannels.includes(item.id)" v-bind:id="item.id" @change="onSettingCheck($event.target.value, settings.allowedChannels, $event.target.id);" type="checkbox">
            <label class="form-check-label">#{{item.name}}</label>
          </div>
        </div>
        <div style="position:absolute;bottom:0" v-if="paginations.channels.pages.length > 1">
          <nav aria-label="...">
            <ul class="pagination pagination-sm " id="anarchy-pagination">
              <li class="page-item" v-for="(index) in paginations.channels.pages.length" :class="index-1 === paginations.channels.currentPage ? 'active' : ''" >
                <a @click="paginations.channels.currentPage = index-1;" class="page-link" href="#">{{index}}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </anarchy-row>
    <anarchy-row label="Allowed changes">
      <div v-if="paginations.changes.pages.length > 0" :style="(paginations.changes.pages.length > 1 ? (getHeightStyle(availableChanges.length, 4, 40)) : '')+'position: relative;'">
        <div class="form-check" v-for="(item, index) in paginations.changes.pages[paginations.changes.currentPage].items" v-bind:key="index">
          <div class="form-check form-switch" id="anarchy-switch">
            <input class="form-check-input" :checked="settings.allowedChanges.includes(item.identifier.value)" v-bind:id="item.identifier.value" @change="onSettingCheck($event.target.value, settings.allowedChanges, $event.target.id);" type="checkbox">
            <label class="form-check-label">{{item.identifier.name}}</label>
          </div>
        </div>
        <div style="position:absolute;bottom:0;" v-if="paginations.changes.pages.length > 1">
          <nav aria-label="...">
            <ul class="pagination pagination-sm " id="anarchy-pagination">
              <li class="page-item" v-for="(index) in paginations.changes.pages.length" :class="index-1 === paginations.changes.currentPage ? 'active' : ''" >
                <a @click="paginations.changes.currentPage = index-1;" class="page-link" href="#">{{index}}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </anarchy-row>
  </anarchy-block>
</template>
