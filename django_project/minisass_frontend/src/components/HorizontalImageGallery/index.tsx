import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

interface Image {
  id: number;
  image: string
}

interface GalleryProps {
  images: Image[];
}


const HorizontalImageGallery: React.FC<GalleryProps> = ({images}) => {

  return (
    <ImageList sx={{overflowX: 'auto'}} rowHeight={200}>
      <ImageListItem sx={{display: 'flex', flexDirection: 'row'}}>
        {images.map(image => {
          return (
            <img
              src={image.image}
              srcSet={image.image}
              alt={image.image}
              loading='lazy'
              style={{paddingRight: '1em', border: 'solid'}}
            />
          )
        })}
      </ImageListItem>
    </ImageList>
  )

}

export default HorizontalImageGallery;