import React from 'react'

import Link from '../components/Link'
import content from '../utils/legals'

const LegalNoticesPage = () => {
  const { introduction, sections } = content
  return (
    <main className='main legal-notices-page'>
      <p className='legal-notices-page__introduction'>
        {introduction}
      </p>
      <div className='legal-notices-page__sections'>
        {
          sections.map(({title, text}, index) => (<div
            className='legal-notices-page__sections__item'
            key={index}>
            <p className='legal-notices-page__sections__item__title'>
              {title}
            </p>
            <p className='legal-notices-page__sections__item__text'>
              {text}
            </p>
          </div>))
        }
      </div>
      <Link className='button button--large legal-notices-page__back'
        href='/'> Back to Home </Link>
    </main>
  )}

export default LegalNoticesPage
