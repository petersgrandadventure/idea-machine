import React from 'react'
import style from './index.module.css'

export const CreateChallengeForm = ({ submit }) => {
  return (
    <form
      className={style.component}
      onSubmit={e => {
        e.preventDefault()

        const title = e.target[0].value
        const description = e.target[1].value
        const end_date = e.target[2].value

        if (title.length === 0) {
          return
        }

        submit({
          title,
          description,
          end_date
        })
        e.target[0].value = ''
        e.target[1].value = ''
        e.target[2].value = ''
      }}
    > <label>Create A New Challenge</label>
      <input placeholder='Title...' className={style.challengeTitle} />
      <input placeholder='Description...' />
      <input placeholder='End Date...' type="date" />
      <button type='submit'>
      <svg id="add" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
      </button>
    </form>
  )
}
