import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ExportedImage from 'next-image-export-optimizer';
import Head from 'next/head';
import markdownToHtml from '../../../lib/markdownToHtml';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useState, useEffect } from 'react';

const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === 'true';

interface BlogPostProps {
  title: string;
  date: string;
  content: string;
  image: string;
  description: string;
  artwork?: string;
}

// Extracted components for reusability
const BlogPostHeader = ({ title, description, imagePath, router }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    {/* Open Graph tags */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imagePath} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={`${router.asPath}`} />
    <meta property="og:site_name" content="Your Site Name" />
    {/* Twitter Card tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imagePath} />
    {/* Additional tags for SEO */}
    <link rel="canonical" href={`${router.asPath}`} />
  </Head>
);

const BlogPostContent: React.FC<{ title: string; date: string; content: string; imagePath: string; artwork?: string }> = ({ title, date, content, imagePath, artwork }) => {
  const router = useRouter();
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/blog');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <BackArrow onClick={handleBackClick}>&larr; Back</BackArrow>
      <ImageWrapper>
        <ExportedImage
          src={imagePath}
          alt={title}
          layout="responsive"
          width={800}
          height={400}
          placeholder={'blur'}
        />
        {artwork && <Artwork>Artwork: {artwork}</Artwork>}
      </ImageWrapper>
      <Title>{title}</Title>
      <Date>{date}</Date>
      <Content dangerouslySetInnerHTML={{ __html: content }} />
      {showScrollButton && <ScrollToTopButton onClick={scrollToTop}><span>^</span></ScrollToTopButton>}
    </>
  );
};

export default function BlogPost({ title, date, content, image, description, artwork }: BlogPostProps) {
  const router = useRouter();
  const imagePath = isExport ? `${image}` : image;

  return (
    <>
      <BlogPostHeader title={title} description={description} imagePath={imagePath} router={router} />
      <BlogPostContent title={title} date={date} content={content} imagePath={imagePath} artwork={artwork} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace(/\.md$/, '') },
  }));
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const filePath = path.join(process.cwd(), 'posts', `${params.slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);
  return { props: { ...data, content: htmlContent, artwork: data.artwork || null } };
}

// Styled Components
const BackArrow = styled.div`
  align-self: flex-start;
  margin-bottom: 20px;
  text-transform: uppercase;
  background: none;
  border: none;
  color: black;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #B3B3B3;
    text-decoration: none;
  }
  @media (max-width: 480px) {
    margin-bottom: 40px;
  }

  &:hover {
    text-decoration: none;
    color: #555;
  }
`;

const Artwork = styled.p`
  font-style: italic;
  color: #555;
  text-align: center;
  font-size: .95rem;
  font-weight: 300;

  @media (min-width: 768px) {
    font-size: .8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;

  @media (min-width: 1024px) {
    max-width: 400px;
  }

  @media (max-width: 1024px) {
    max-width: 800px;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Date = styled.p`
  font-size: 1rem;
  color: #777;
`;

const Content = styled.div`
  font-size: 20px;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  width: 100%;

  h2, h3, h4 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;
  }

  a {
    color: #0070f3;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  max-width: 600px;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 25px;
  right: 30px;
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #F0F0F0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-family: system-ui;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 200;
  opacity: 0.7;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 1000; /* Ensure the button is above other content */

  span {
    margin-top: 5px; /* Add margin-top to the span */
  }

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    font-size: 30px;
    bottom: 20px;
    right: 15px;

    span {
      margin-top: 4px; /* Adjust margin-top to the span */
    }
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    font-size: 28px;
    bottom: 15px;
    right: 12px;

    span {
      margin-top: 4px; /* Adjust margin-top to the span */
    }
  }
`;

