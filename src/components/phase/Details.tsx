export const Details = ({ description }: { description: string }) => {
  return (
    <>
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </>
  );
};

export default Details;
