import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type Joke = {
  id: number;
  joke: string;
  rate: number;
};

const schema = yup.object().shape({
  joke: yup.string().required("Joke is required").min(5, "Joke must be at least 5 characters"),
});

export const JokesComponent: React.FC = () => {
  const [jokes, setJokes] = useState<Joke[]>([
    { id: 1, joke: "What do you call a very small valentine? A valen-tiny!!!", rate: 0 },
    { id: 2, joke: "What did the dog say when he rubbed his tail on the sandpaper? Ruff, Ruff!!!", rate: 5 },
    { id: 3, joke: "Why don't sharks like to eat clowns? Because they taste funny!!!", rate: 10 },
  ]);

  const [editId, setEditId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<{ joke: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { joke: string }) => {
    if (editId !== null) {
      setJokes(jokes.map(j => j.id === editId ? { ...j, joke: data.joke } : j));
      setEditId(null);
    } else {
      const newJoke: Joke = {
        id: Date.now(),
        joke: data.joke,
        rate: 0,
      };
      setJokes([newJoke, ...jokes]);
    }
    reset();
  };

  const handleEdit = (id: number) => {
    const jokeToEdit = jokes.find(j => j.id === id);
    if (jokeToEdit) {
      setValue("joke", jokeToEdit.joke);
      setEditId(jokeToEdit.id);
    }
  };

  const handleDelete = (id: number) => {
    setJokes(jokes.filter(j => j.id !== id));
    if (editId === id) {
      setEditId(null);
      reset();
    }
  };

  const increaseRate = (id: number) => {
    setJokes(jokes.map(j => j.id === id ? { ...j, rate: j.rate + 1 } : j));
  };

  const decreaseRate = (id: number) => {
    setJokes(jokes.map(j => j.id === id ? { ...j, rate: j.rate - 1 } : j));
  };

  return (
    <div className="container">
      <h2>😂 Jokes For You</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input
          {...register("joke")}
          placeholder="Enter your joke"
          className="input"
        />
        <button type="submit" className="btn">
          {editId !== null ? "Update Joke" : "Add Joke"}
        </button>
        {errors.joke && <p className="error">{errors.joke.message}</p>}
      </form>

      <div className="jokes">
        {jokes.map(joke => (
          <div className="joke-card" key={joke.id}>
            <p className="joke-text">{joke.joke}</p>
            <div className="rate">Rating: {joke.rate}</div>
            <div className="actions">
              <button onClick={() => increaseRate(joke.id)}>👍</button>
              <button onClick={() => decreaseRate(joke.id)}>👎</button>
              <button onClick={() => handleEdit(joke.id)}>✏️</button>
              <button onClick={() => handleDelete(joke.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
