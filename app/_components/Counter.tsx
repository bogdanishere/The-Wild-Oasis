"use client";
import { useState } from "react";

interface UserProps {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

export default function Counter({ users }: { users: UserProps[] }) {
  const [count, setCount] = useState(0);

  console.log(users);
  return (
    <div>
      <div>Counter</div>
      <p>There are {users.length} users</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
