export const Footer = () => {
  return (
    <footer className='shadow-lg p-3'>
      <p className='text-center'>
        M-Bias Is A Digital Content Platform, Specifically Tailoered For HSC
        Students Directly Alligned With Thier Text Books And Easily Accessible
        At Their Finger Tips With Just A QR Code Scan.
      </p>
      <div className='text-center'>
        <span>
          &#169;
          {`${new Date().getFullYear()} MBias Inc. All Rights Reserved `}
        </span>
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
