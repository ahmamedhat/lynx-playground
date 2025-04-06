import './ImageCard.css';

export default function ImageCard(props: { picture: any }) {
  const { picture } = props;
  return (
    <view className="picture-wrapper">
      <image
        className="image"
        style={{
          width: '100%',
          aspectRatio: picture.width / picture.height,
        }}
        src={picture.src}
      />
    </view>
  );
}
