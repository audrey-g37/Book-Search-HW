import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
// import { getMe, deleteBook } from '../utils/API';
import { Redirect, useParams } from "react-router";
import Auth from "../utils/auth";
// import { User } from "../../server/models";
// import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  const userId = useParams();

  const { loading, data } = useQuery(QUERY_ME, {
    variables: { userId: userId },
  });

  const userInfo = data?.me || data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userInfo?.username) {
    return <h4>You need to be logged in to use this feature.</h4>;
  }

  // try {
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;

  //   if (!token) {
  //     return false;
  //   }

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

    const userInfo = data?.me || data?.user || {};

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!userInfo?.username) {
      return <h4>You need to be logged in to use this feature.</h4>;
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
  if (!userInfo) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
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
