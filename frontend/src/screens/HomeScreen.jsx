import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl, Alert, Card } from 'react-bootstrap';
import { useShortenUrlMutation } from '../slices/usersApiSlice';

const HomeScreen = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState(null);
  const [shortenUrl] = useShortenUrlMutation();

  const handleUrlShorten = async (e) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    setError(null);

    try {
      const { shortUrlCode } = await shortenUrl({ longUrl }).unwrap();
      setShortUrl(`http://localhost:5000/api/users/${shortUrlCode}`);
    } catch (err) {
      setError(err.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="containerMain my-5">
      <Card className="shadow border-0">
        <Card.Body>
          <h1 className="mb-4 text-center">URL Shortener</h1>
          <Form onSubmit={handleUrlShorten}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Enter long URL"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="border-0"
              />
              <Button type="submit" variant="primary">
                Shorten URL
              </Button>
            </InputGroup>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          {shortUrl && (
            <Alert variant="success">
              <strong className='me-2'>Shortened URL:</strong>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomeScreen;
