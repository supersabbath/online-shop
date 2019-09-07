import React, { Component } from "react";
import "./Details.css";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addItemInCart } from "../../Redux/Actions";
import Api from "../../Api";
import Item from "../Item/Item";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

var Remarkable = require("remarkable");

class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {
      relatedItems: [],
      quantity: "1",
      item: null,
      unfinishedTasks: 0
    };
  }

  async fetchProductUsingID(id) {
    this.setState(ps => ({ unfinishedTasks: ps.unfinishedTasks + 1 }));

    // First, let's get the item, details of which we want to show.
    let item = await Api.getItemUsingID(id);

    // Now, get items from same category.
    let relatedItems = await Api.searchItems({
      category: item.category,
      page: "1",
      itemsPerPage: "5"
    });

    if (this.isCompMounted) {
      this.setState(ps => {
        return {
          item,
          unfinishedTasks: ps.unfinishedTasks - 1,
          relatedItems: relatedItems.data.filter(x => x.id !== item.id)
        };
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProductUsingID(nextProps.match.params.id);
  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchProductUsingID(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }

  // Product information contains markup, we use Remarkable for this.
  getRawMarkup(data) {
    const md = new Remarkable();
    return { __html: md.render(data) };
  }

  render() {
    if (this.state.unfinishedTasks !== 0) {
      return <CircularProgress className="circular" />;
    }

    if (!this.state.item) {
      return null;
    }

    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      focusOnSelect: false,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    let settingsRelatedItems = {
      dots: true,
      infinite: true,
      speed: 500,
      focusOnSelect: false,
      slidesToShow:
        this.state.relatedItems.length < 3 ? this.state.relatedItems.length : 3,
      slidesToScroll:
        this.state.relatedItems.length < 3 ? this.state.relatedItems.length : 3
    };

    return (
      <div className="details" style={{ padding: 10 }}>
        <div
          style={{
            marginBottom: 20,
            marginTop: 10,
            fontSize: 24
          }}
        >
          {this.state.item.name}
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: 290,
              height: 290,
              paddingTop: 5,
              paddingBottom: 5,
              paddingLeft: 40,
              paddingRight: 40,
              border: "1px solid lightgray",
              borderRadius: "5px"
            }}
          >
            <Slider {...settings}>
              {this.state.item.imageUrls.map(x => {
                // NOTE: If I pass img directly instead of wrapping it in div, this component seems to mess up its styles.
                return (
                  <div key={x}>
                    <img
                      alt="Item"
                      style={{
                        objectFit: "contain",
                        height: 290,
                        width: 290
                      }}
                      src={x}
                    />
                  </div>
                );
              })}
            </Slider>
          </div>
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ fontSize: 18, marginTop: 10 }}>
              Price: {this.state.item.price} $
            </div>
            {this.state.item.popular && (
              <span style={{ marginTop: 5, fontSize: 14, color: "#228B22" }}>
                (Popular product)
              </span>
            )}

            <TextField
              type="number"
              value={this.state.quantity}
              style={{ marginTop: 20, marginBottom: 20, width: 50 }}
              label="Quantity"
              onChange={e => {
                let val = parseInt(e.target.value);
                if (val < 1 || val > 10) return;
                this.setState({ quantity: val.toString() });
              }}
            />
            <Button
              style={{ width: 200, marginTop: 5 }}
              color="primary"
              variant="contained"
              onClick={() => {
                this.props.dispatch(
                  addItemInCart({
                    ...this.state.item,
                    quantity: parseInt(this.state.quantity)
                  })
                );
              }}
            >
              Add to Cart <AddShoppingCartIcon style={{ marginLeft: 5 }} />
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            marginBottom: 10,
            fontSize: 24
          }}
        >
          Product Description
        </div>


        {/* Item description */}
        <div
          style={{
            marginLeft: 5,
            maxHeight: 200,
            fontSize: 13,
            marginTop: !this.state.item.description && 20,
            marginBottom: !this.state.item.description && 20,
            overflow: "auto"
          }}
          dangerouslySetInnerHTML={this.state.item.description ? this.getRawMarkup(
            this.state.item.description
          ) : { __html: "Not available" }}
        />


        <div
          style={{
            marginTop: 10,
            marginBottom: 20,
            fontSize: 24
          }}
        >
          Related Items
        </div>

        {/* Relateditems */}
        {this.state.relatedItems.length === 0 ? (
          <div
            style={{
              fontSize: 13,
              marginLeft: 10,
              marginBottom: 10
            }}
          >
            Not available
          </div>
        ) : (
            <div style={{ width: 600, height: 320, paddingLeft: 40 }}>
              <Slider {...settingsRelatedItems}>
                {this.state.relatedItems.map(x => {
                  return <Item key={x.id} item={x} />;
                })}
              </Slider>
            </div>
          )}
      </div>
    );
  }
}

let Details = connect()(ConnectedDetails);
export default Details;
