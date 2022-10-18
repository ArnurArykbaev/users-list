class Data {
  constructor(currentPage) {
    this.currentPage = currentPage
  }

  async getUsersList(currentPage) {
    let skip;
    if (currentPage === 1) {
      skip = currentPage - 1;
    } else {
      skip = currentPage * dataLimit - dataLimit;
    }
    const apiUrl = `${baseURL}/users?skip=${skip}&limit=${dataLimit}`;

    const dataArray = await getData(apiUrl);
    return dataArray;
  }

  async getData(apiUrl) {
    const data = await fetchData(apiUrl);
    total = data.total;
    const dataArr = Object.values(data)[0];
    if (dataArr === undefined || dataArr.length === 0) {
      alert("data empty");
      return;
    }

    return dataArr;
  }
}

const data = new Data();

export default data;


export function Kek() {
  console.log('hello from other side')
}