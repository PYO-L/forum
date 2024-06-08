import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      console.log(token);
      fetchPost();
      fetchComments();
    }
  }, [id, token]);

  const fetchPost = async () => {
    try {
      if (token) {
        const response = await axios.get(
          `http://localhost:8080/api/posts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPost(response.data);
      }
    } catch (error) {
      console.error('게시물 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/posts/${id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/api/posts/${id}/comments`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments();
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleEditCommentChange = (e) => {
    setEditingCommentContent(e.target.value);
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const handleEditCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/posts/${id}/comments/${editingCommentId}`,
        {
          content: editingCommentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments();
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };
  const deleteComment = async (comment) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/posts/${id}/comments/${comment.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{post.title}</h1>
          <h2 className="card-text">{post.content}</h2>
          <Link to={`/post/${id}/edit`} className="btn btn-primary mt-3">
            게시글 수정
          </Link>
        </div>
      </div>

      <div className="comments">
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="댓글을 입력하시오"
              value={newComment}
              onChange={handleCommentChange}
            />
            <button type="submit" className="btn btn-success">
              create
            </button>
          </div>
        </form>

        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="card mb-3">
              <div className="card-body">
                {editingCommentId === comment.id ? (
                  <form onSubmit={handleEditCommentSubmit}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={editingCommentContent}
                        onChange={handleEditCommentChange}
                      />
                      <button type="submit" className="btn btn-warning">
                        update
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h5 className="card-title">{comment.username}</h5>
                    <p className="card-text">{comment.content}</p>
                    <button
                      onClick={() => startEditingComment(comment)}
                      className="btn btn-secondary me-2"
                    >
                      댓글 수정
                    </button>
                    <button
                      onClick={() => deleteComment(comment)}
                      className="btn btn-danger"
                    >
                      댓글 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
