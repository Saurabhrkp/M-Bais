import { withRouter } from 'next/router';
import NavLink from 'react-bootstrap/NavLink';

const ActiveLink = ({ router, href, children }) => {
  (function prefetchPages() {
    if (typeof window !== 'undefined') {
      router.prefetch(router.pathname);
    }
  })();

  const handleClick = (event) => {
    router.push(href);
  };

  const isCurrentPath = router.pathname === href || router.asPath === href;

  return (
    <NavLink
      onSelect={handleClick}
      style={{
        fontWeight: isCurrentPath ? 'bold' : 'normal',
        color: isCurrentPath ? '#2fb418' : '#fff',
      }}
    >
      {children}
    </NavLink>
  );
};

export default withRouter(ActiveLink);
