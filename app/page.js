"use client";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Cart from "./components/Cart";

export default function Home() {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(
          `http://localhost:5110/api/Stock/getdata`
        );
        if (result.status === 200) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    const updatedData = data.map((dataItem) =>
      dataItem.id === item.id
        ? { ...dataItem, quantity: dataItem.quantity - 1 }
        : dataItem
    );
    setData(updatedData);
  };

  const removeFromCart = (item) => {
    const updatedCart = cart.filter(cartItem => cartItem.id !== item.id);

    const updatedData = data.map(dataItem =>
      dataItem.id === item.id
        ? { ...dataItem, quantity: dataItem.quantity + item.quantity }
        : dataItem
    );

    setCart(updatedCart);
    setData(updatedData);
  };

  const clearCart = () => {
    const updatedData = data.map((dataItem) => {
      const cartItem = cart.find((cartItem) => cartItem.id === dataItem.id);
      return cartItem
        ? { ...dataItem, quantity: dataItem.quantity + cartItem.quantity }
        : dataItem;
    });

    setCart([]);
    setData(updatedData);
  };

  const decrementQuantity = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem && existingItem.quantity > 1) {
      // ลดจำนวนในตะกร้า
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
  
      // อัปเดตข้อมูล
      const updatedData = data.map(dataItem =>
        dataItem.id === item.id
          ? { ...dataItem, quantity: dataItem.quantity + 1 }
          : dataItem
      );
      setData(updatedData);
    }
  };

  const incrementQuantity = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // เพิ่มจำนวนในตะกร้า
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
  
      // อัปเดตข้อมูล
      const updatedData = data.map(dataItem =>
        dataItem.id === item.id
          ? { ...dataItem, quantity: dataItem.quantity - 1 }
          : dataItem
      );
      setData(updatedData);
    }
  };



  const calculateTotal = () => {
    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(data);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:5110/api/Stock/update", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

      setCart([])

  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3">
          {data.map((item, index) => (
            <Card key={index} style={{ width: "19rem" }} className="mt-3">
              <Card.Body>
                <Card.Title>Name: {item.name}</Card.Title>
                <Card.Text>
                  Price: {item.price}
                  <br />
                  Quantity: {item.quantity}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => addToCart(item)}
                  disabled={item.quantity === 0}
                >
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="col-lg-4">
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            decrementQuantity={decrementQuantity}
            incrementQuantity={incrementQuantity}
          />
        </div>
        <div className="col-lg-3">
          <Button
            className="mx-3 mt-5"
            variant="success"
            onClick={calculateTotal}
          >
            คิดเงิน
          </Button>
          <br />
          Total: {total} บาท
        </div>
      </div>
    </div>
  );
}
