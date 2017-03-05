import React from 'react'

import Link from './Link'
import Logo from './Logo'
import { links } from '../utils/config'

const Header = ({
  darkHeaderBackground
}) => (<header className='header'>
  <div className='header__top-nav flex items-center relative'>
    <div className='header__top-nav__logo'>
      <Link
        className='header__top-nav__logo__link col'
        external='true'
        href='http://cri-paris.org/en/discover-itcounts-start-promoting-gender-balance/'
      >
        <Logo />
      </Link>
      <div className='header__top-nav__logo__text col'>
        <p className='header__top-nav__logo__text__p'>
          PARIT&Eacute; AU POUVOIR
        </p>
      </div>
    </div>
    <div className='flex-auto' />
    <div className='header__top-nav__links'>
      {links.map(({label, sectionId}, index) => {
        return (<Link
          className='link header__top-nav__links__link'
          key={index}
          href={`/#${sectionId}`}
          onClick={() => {
            document.querySelector(`section#${sectionId}`)
                    .scrollIntoView({behavior: 'smooth'})
          }}
          {...{forceAnchorElement: true}}
        >
            {label}
        </Link>) })}
    </div>
  </div>
</header>)

export default Header
