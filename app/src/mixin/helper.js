import moment from "moment";
export default {
  methods: {
    objectToArray(object){
      const array = [];
      Object.keys(object).forEach((id) => {
        array.push(object[id]);
      });
      return array;
    },
    dateFormat(date, format) {
      return moment(date).format(format);
    },
    formatDateTime(d){
      return d.toISOString();
    }
  },
};