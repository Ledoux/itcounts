import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'

import Link from './Link'
import Logo from './Logo'
import { showModal } from '../reducers/modal'
import { links } from '../utils/constants'

const Header = ({
  darkHeaderBackground
}) => (<header className='header'>
  <div className='header__top-nav flex items-center relative'>
    {/* all these routes are actually external except developers */}
    <Link
      className='header__top-nav__link mr3'
      external='true'
      href='http://cri-paris.org/en/discover-itcounts-start-promoting-gender-balance/'
    >
      <Logo className='header__top-nav__logo' onTopOfDarkSection />
    </Link>
    <div className='xs-hide'>
      {links.map(({external, extraClass, label, path}, index) => {
        return (<Link
          className={classnames('header__top-nav__link py2 mr3',
            extraClass)}
          key={index}
          {...{href: path, external}} >
            {label}
        </Link>) })}
    </div>
  </div>
</header>)

export default connect(null, { showModal })(Header)
