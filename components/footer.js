export const Footer = () => {
  return (
    <footer className='shadow-lg p-3'>
      <h3 className='text-center'>Statically Generated with Next.js.</h3>
      <div className='text-center'>
        <a href='https://nextjs.org/docs/basic-features/pages' className='m-1'>
          By Saurabh Patel
        </a>
        <a href={`https://github.com/Saurabhrkp`} className='m-1'>
          View on GitHub ⚡
        </a>
      </div>
    </footer>
  );
};
