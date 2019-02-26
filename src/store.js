import Vue from 'vue'
import Vuex from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import * as types from './store/mutation-types'
import {loadSearch, loadPlay,loadFavorite,saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'
Vue.use(Vuex)

function findIndex(list, song){ // 实测没用 let _arr = arr.slice(); // 已经解决问题
  return list.findIndex((item) => {
      return item.id === song.id
  })
}

export default new Vuex.Store({
  state: {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
  },
  mutations: {
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
      state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
      state.fullScreen = flag
    },
    [types.SET_PLAY_LIST](state, list) {
      state.playlist = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
      state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
      state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
      state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
      state.disc = disc
    },
    [types.SET_TOP_LIST](state, topList) {
      state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state, history) {
      state.searchHistory = history
    },
    [types.SET_PLAY_HISTORY](state, history) {
      state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state, list) {
      state.favoriteList = list
    }
  },
  getters: {
    singer:(state)=> state.singer,

    playing:(state)=> state.playing,

    fullScreen:(state)=> state.fullScreen,

    playlist:(state)=> state.playlist,

    sequenceList:(state)=> state.sequenceList,

    mode:(state)=> state.mode,

    currentIndex:(state)=> state.currentIndex,

    currentSong:(state) => state.playlist[state.currentIndex] || {},

    disc:(state)=> state.disc,

    topList:(state)=> state.topList,

    searchHistory:(state)=> state.searchHistory,

    playHistory:(state)=> state.playHistory,

    favoriteList:(state)=> state.favoriteList

  },
  actions: {
    selectPlay ({commit, state}, {list, index}) {
      commit(types.SET_SEQUENCE_LIST, list)
      // if(state.mode === playMode.random) { // 实测没用 let _arr = arr.slice(); // 已经解决问题
      //     let randomList = shuffle(list)
      //     commit(types.SET_PLAY_LIST, randomList)
      //     index = findIndex(randomList, list[index])
      // }else{
      //     commit(types.SET_PLAY_LIST, list)
      // }
      commit(types.SET_PLAY_LIST, list)
      commit(types.SET_CURRENT_INDEX, index)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    },
    randomPlay ({commit},{list}) {
      commit(types.SET_PLAY_MODE,playMode.random)
      commit(types.SET_SEQUENCE_LIST, list)
      let randomList = shuffle(list)
      commit(types.SET_PLAY_LIST, randomList)
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
    },
    savePlayHistory({commit}, song) {
      commit(types.SET_PLAY_HISTORY, savePlay(song))
    },
    insertSong({commit, state}, song) {
      let playlist = state.playlist.slice() //副本
      let sequenceList = state.sequenceList.slice() //副本
      let currentIndex = state.currentIndex
      //记录当前歌曲
      let currentSong = playlist[currentIndex]
      //查找当前列表中是否有待插入的歌曲并返回其索引
      let fpIndex = findIndex(playlist, song)
      //因为是插入歌曲，所以索引+1
      currentIndex++
      //插入这首歌到当前索引位置
      playlist.splice(currentIndex, 0, song)
      //如果已经包含了这首歌
      if(fpIndex > -1) {
         //如果当前插入的序号大于列表中的序号
         if(currentIndex > fpIndex) {
             playlist.splice(fpIndex, 1)
             currentIndex--
         }else{
             playlist.splice(fpIndex+1, 1)
         }
      }
  
      let currentSIndex = findIndex(sequenceList, currentSong) + 1
  
      let fsIndex = findIndex(sequenceList, song)
      
      sequenceList.splice(currentSIndex, 0, song)
  
      if(fsIndex > -1){
          if(currentSIndex > fsIndex){
              sequenceList.splice(fsIndex, 1)
          }else{
              sequenceList.splice(fsIndex + 1, 1)
          }
      }
  
      commit(types.SET_PLAY_LIST, playlist)
      commit(types.SET_SEQUENCE_LIST, sequenceList)
      commit(types.SET_CURRENT_INDEX, currentIndex)
      commit(types.SET_FULL_SCREEN, true)
      commit(types.SET_PLAYING_STATE, true)
   },
   deleteSong({commit, state}, song) {
    let playlist = state.playlist.slice() //副本
    let sequenceList = state.sequenceList.slice() //副本
    let currentIndex = state.currentIndex

    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if(currentIndex > pIndex || currentIndex === playlist.length){
       currentIndex--
    }
    commit(types.SET_PLAY_LIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE,playingState)
  },
  saveSearchHistory({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
  },
  deleteSearchHistory({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
  },
  clearSearchHistory({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearSearch()) 
  },
  deleteSongList({commit}) {
    //将所有值都重置为初始状态
    commit(types.SET_PLAY_LIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
  },
  savePlayHistory({commit}, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
  },
  saveFavoriteList({commit}, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
  },
  deleteFavoriteList({commit}, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
  }
  }
})
