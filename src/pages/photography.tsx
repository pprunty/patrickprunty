import React from 'react';
import styled from 'styled-components';
import ExportedImage from 'next-image-export-optimizer';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Title = styled.h1`
  font-size: 6vw;
  font-weight: 600;
  line-height: .9em;
  color: black;
  width: 100%;
  text-align: left;
  margin-bottom: 20px; /* Add margin to separate title from case studies */

  @media(max-width: 768px) {
    font-size: 8vw;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.5em;
  color: #666;
  width: 100%;
  text-align: left;
  margin-bottom: 40px; /* Add margin to separate subtitle from case studies */
  padding-bottom: 40px;
//   border-bottom: 2px solid black;

  @media(max-width: 768px) {
    font-size: 1.25rem;
      padding-bottom: 5px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1200px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 5px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-height: auto;
  max-width: 600px;
`;

const images = [
  '/images/0a94d7f5-834a-4567-86db-93f1ce8dc3ca.JPG',
  '/images/2d8324a2-e783-47d8-aa1c-3891e7a8b541.JPG',
  '/images/9977ee3f-d4bd-4ce6-a57c-04397898b222.JPG',
  // '/images/a8b62ad2-008f-4084-af78-e5f5babfd5ea.JPG',
  // '/images/af1874ac-3277-435d-83dd-5ba41fb4b7af.JPG',
  // '/images/c57ad8ca-ee1e-4d3d-a9f6-9b0222e211da.JPG'
];

const isExport = process.env.NEXT_PUBLIC_IS_EXPORT === 'true';

const Photography: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Patrick Prunty - Photography</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
        <meta property="og:image" content="/images/collage.WEBP" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${router.asPath}`} />
      </Head>
      <Title>Patrick Prunty's Photography</Title>
      <Subtitle>Discover the world through my lens. Here are some of my favorite shots capturing moments and stories from around the globe.</Subtitle>
      <Grid>
        {images.map((src, index) => {
          const imagePath = isExport ? `${src}` : src;
          return (
            <ImageWrapper key={index}>
              <ExportedImage
                src={imagePath}
                alt={`Photography ${index + 1}`}
                layout="responsive"
                width={600}
                height={500}
                objectFit="cover"
                placeholder={'blur'}
              />
            </ImageWrapper>
          );
        })}
      </Grid>
    </>
  );
};

export default Photography;
