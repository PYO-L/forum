import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  Card,
  ListGroup,
  Row,
  Col,
} from 'react-bootstrap';
export const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    console.log(token);
    try {
      const response = await axios.get('http://localhost:8080/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setPosts(response.data);
      setToken(localStorage.getItem('token'));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8080/api/posts',
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // 새로운 게시물 생성
      setTitle(''); // 입력 필드 초기화
      setContent(''); // 입력 필드 초기화
      if (token) {
        fetchData();
      }
      // 새로운 게시물을 포함한 목록을 다시 불러오기
    } catch (error) {
      if (error.response) {
        // 서버로부터 응답이 온 경우
        console.error('게시물 생성 중 오류 발생:', error.response.data);
      } else if (error.request) {
        // 요청이 완료되지 않은 경우
        console.error('게시물 생성 중 오류 발생:', error.request);
      } else {
        // 오류를 발생시킨 요청 설정 등의 문제
        console.error('게시물 생성 중 오류 발생:', error.message);
      }
    }
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onContentChange = (e) => {
    setContent(e.target.value);
  };

  const postDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Create Post</h2>
          <Form onSubmit={submitForm}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={onTitleChange}
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group controlId="formContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={onContentChange}
                placeholder="Enter content"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Post List</h2>
          <ListGroup>
            {posts.map((post) => (
              <ListGroup.Item key={post.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                    <footer className="blockquote-footer">
                      {post.username}
                    </footer>
                    <Button
                      variant="danger"
                      onClick={() => postDelete(post.id)}
                      className="mt-3"
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default PostList;
