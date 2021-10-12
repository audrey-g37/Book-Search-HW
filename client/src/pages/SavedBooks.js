import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
// import { getMe, deleteBook } from '../utils/API';
import { useParams } from "react-router";
import Auth from "../utils/auth";
// import { User } from "../../server/models";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_ME : QUERY_ME, {
    variables: { userId: userParam },
  });

  const userInfo = data?.me || data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (Auth.loggedIn() && !Auth.getProfile().data.username === userParam) {
    return <Redirect to="/saved" />;
  }

  if (!Auth.loggedIn()) {
    return <h4>You need to be logged in to use this feature.</h4>;
  }
  // try {
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;

  //   if (!token) {
  //     return false;
  //   }
  //   return token;

  //   const response = await getMe(token);

  //   if (!response.ok) {
  //     throw new Error("something went wrong!");
  //   }

  //   const user = await response.json();
  //   setUserData(user);
  // } catch (err) {
  //   console.error(err);
  // }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    // const bookId = useParams();

    const { data } = await (REMOVE_BOOK,
    {
      variables: { bookId: bookId },
    });

    if (loading) {
      return <div>Loading...</div>;
    }

    // try {
    //   const response = await deleteBook(bookId, token);

    //   if (!response.ok) {
    //     throw new Error("something went wrong!");
    //   }

    //   const updatedUser = await response.json();
    //   setUserData(updatedUser);
    //   // upon success, remove book's id from localStorage
    //   removeBookId(bookId);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  // if data isn't here yet, say so

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userInfo.savedBooks.length >0
            ? `Viewing ${userInfo.savedBooks.length} saved ${
                userInfo.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userInfo.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
