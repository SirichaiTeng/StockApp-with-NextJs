import React from "react";
import { Card, Button } from "react-bootstrap";

const Cart = ({
  cart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
}) => {
  return (
    <div className="mt-3">
      <Card className=" shadow p-2 align-items-center">
        <div className="d-flex ">
          <h2>Cart</h2>
        </div>

        <Button className="btn-sm" variant="danger" onClick={() => clearCart()}>
          Remove All
        </Button>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <Card key={index} className=" shadow p-2 align-items-center" style={{ width: "18rem", margin: "10px" }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Price: {item.price}
                  <br />
                  Total:
                  <Button
                    className="btn btn-sm btn-light"
                    onClick={() => decrementQuantity(item)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                        {item.quantity}
                  <Button
                    className="btn btn-sm btn-light"
                    onClick={() => incrementQuantity(item)}
                  >
                    +
                  </Button>
                </Card.Text>
                <Button variant="danger" onClick={() => removeFromCart(item)}>
                  Remove
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </Card>
    </div>
  );
};

export default Cart;
