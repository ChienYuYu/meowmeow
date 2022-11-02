import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
  state: {
    catData: [],
    isLoading: false,
    totalPage: 0,
    eachPageData: [],
    pageIndex: 0,
    cityAndSex: {},

  },
  getters: {
    filterShow(state) {
      if (state.cityAndSex.city !== '請選擇縣市' && state.cityAndSex.sex === '請選擇性別') {
        return state.catData.filter((item) => item.shelter_address.match(state.cityAndSex.city));
      }
      if (state.cityAndSex.city === '請選擇縣市' && state.cityAndSex.sex !== '請選擇性別') {
        return state.catData.filter((item) => item.animal_sex.match(state.cityAndSex.sex));
      }
      if (state.cityAndSex.city !== '請選擇縣市' && state.cityAndSex.sex !== '請選擇性別') {
        return state.catData.filter((item) => item.shelter_address.match(state.cityAndSex.city)
        && item.animal_sex.match(state.cityAndSex.sex));
      }
      return state.catData;
    },
    showData(state) {
      return state.eachPageData[state.pageIndex];
    },
  },
  mutations: {
    getCat(state, data) {
      state.catData = data.filter((item) => item.animal_kind === '貓');
      state.isLoading = true;
    },
    filterCitySex(state, data) {
      state.cityAndSex = data;
      state.pageIndex = 0;
    },
    countPage(state) {
      state.eachPageData = []; // 先清空 不然會累積越多
      state.totalPage = Math.ceil(this.getters.filterShow.length / 30);
      for (let i = 0; i < state.totalPage; i += 1) {
        const tempArr = this.getters.filterShow.slice(i * 30, i * 30 + 30);
        state.eachPageData.push(tempArr);
      }
    },
    // countPage(state) {
    //   state.totalPage = Math.ceil(state.catData.length / 30);
    //   for (let i = 0; i < state.totalPage; i += 1) {
    //     const tempArr = state.catData.slice(i * 30, i * 30 + 30);
    //     state.eachPageData.push(tempArr);
    //   }
    // },
    switchPage(state, calc) {
      if (calc === 'previous') { state.pageIndex -= 1; }
      if (calc === 'next') { state.pageIndex += 1; }
    },
  },
  actions: {
    getApi(context) {
      const apiUrl = 'https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL';
      axios.get(apiUrl)
        .then((res) => {
          context.commit('getCat', res.data);
        });
    },
  },
  modules: {
  },
});
