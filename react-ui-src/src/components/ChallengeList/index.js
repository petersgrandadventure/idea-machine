import React from 'react'
import style from './index.module.css'
import { ChallengeHeader } from '../ChallengeHeader'
import { UserList } from '../UserList'
import { IdeaList } from '../IdeaList'
import { MessageList } from '../MessageList'
import { CreateMessageForm } from '../CreateMessageForm'
import { CreateIdeaForm } from '../CreateIdeaForm' 

const Icon = id => (
  id === 'lock' ? <svg id="lock" viewBox="0 0 24 24">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
</svg> : <svg id="public" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
)

export const ChallengeList = ({
  state,
  challenges = [],
  user,
  users,
  messages,
  idea,
  ideas,
  current,
  actions
}) => (
    <ul className={style.component}>
      {challenges.map(challenge => {
        const attendingCurrent = current.users ? current.users.find(x => x === user.id) : false

        let renderResult = []

        // a little preview of the challenge
        // click to expand
        if (challenge.id !== current.id) {
          renderResult.push(<li
            key={challenge.id}
            disabled={challenge.id === current.id}
            onClick={e => actions.setChallenge(challenge)}
          >
            {Icon(challenge.isPrivate ? 'lock' : 'public')}
            <col->
              <p>{challenge.title.replace(user.id, '')}</p>
              <span>{challenge.description}</span>
              <span>{challenge.end_date}</span>
            </col->
          </li>)
        }

        // the expanded view of the selected challenge
        if (challenge.id === current.id) {
          renderResult.push(<li key={'openHeader' + challenge.id} className={style.openEvent}>
            <ChallengeHeader state={state} actions={actions} />
          </li>)
          renderResult.push(<li key={'openPanel' + challenge.id} className={style.openEvent}>
            <col->
              <h3>Description</h3>
              <h5>{challenge.description}</h5>
            </col->
            <col->
              <UserList
                event={current}
                current={user.id}
                users={users}
                heading="Participants"
              />
            </col-> 
            </li>)
          renderResult.push(<li key={'ideaPanel' + challenge.id} className={style.openEvent}>
            <col->
              {user.id && <CreateIdeaForm actions={actions} challengeId={challenge.id} />}
              <IdeaList
                state={state}
                ideas={ideas}
                user={user}
                users={users}
                messages={messages}
                current={idea}
                actions={actions}
              />
            </col->
            
          </li>)
        }
        return renderResult
      })}
    </ul>
  )
