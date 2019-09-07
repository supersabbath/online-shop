import { sampleProducts } from "./Data";

///
//
// Methods of this class are used to simulate calls to server.
//
class Api {
  getItemUsingID(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let res = sampleProducts.filter(x => x.id === parseInt(id, 10));
        resolve(res.length === 0 ? null : res[0]);
      }, 500);
    });
  }

  sortByPrice(data, sortval) {
    if (!sortval) return data;

    let items = JSON.parse(JSON.stringify(data));

    if (sortval === "lh") {
      items.sort((a, b) =>
        a.price > b.price ? 1 : b.price > a.price ? -1 : 0
      );
    } else if (sortval === "hl") {
      items.sort((a, b) =>
        a.price < b.price ? 1 : b.price < a.price ? -1 : 0
      );
    }

    return items;
  }

  searchItems({
    category = "popular",
    term = "",
    sortValue = "lh",
    itemsPerPage = 5,
    usePriceFilter = false,
    minPrice = 0,
    maxPrice = 1000,
    page = 1
  }) {

    return new Promise((resolve, reject) => {

      setTimeout(() => {

        let data = sampleProducts.filter(item => {
          if (
            usePriceFilter &&
            (item.price < minPrice || item.price > maxPrice)
          ) {
            return false;
          }

          if (category === "popular") {
            return item.popular;
          }

          if (category !== "All categories" && category !== item.category)
            return false;

          if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
            return false;

          return true;
        });

        let totalLength = data.length;

        if (sortValue) {
          data = this.sortByPrice(data, sortValue);
        }

        data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        resolve({ data, totalLength });
      }, 500);
    });
  }
}

export default new Api();
