import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

const PostEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newTitle, newSetTitle] = useState('');
  const [newContent, newSetContent] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { id } = useParams();
  const navigete = useNavigate();

  useEffect(() => {
    if (token) {
      fetchPost();
    }
  }, [id, token]);

  const submitPut = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/posts/${id}`,
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPost();
    } catch {}
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      console.error('게시물 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const handleTitleChange = (e) => {
    newSetTitle(e.target.value);
  };
  const handleContentChange = (e) => {
    newSetContent(e.target.value);
  };
  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{content}</Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Form onSubmit={submitPut}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                placeholder="Enter new title"
                onChange={handleTitleChange}
              />
            </Form.Group>
            <Form.Group controlId="formContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newContent}
                placeholder="Enter new content"
                onChange={handleContentChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
            <Button
              variant="secondary"
              as={Link}
              to={`/post/${id}`}
              className="ms-2"
            >
              Back
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostEdit;
