const { Config, Container, Scenario } = require('@holochain/holochain-nodejs')
Scenario.setTape(require('tape'))
const dnaPath = "dist/bundle.json"
const dna = Config.dna(dnaPath, 'happs')
const agentAlice = Config.agent("alice")
const instanceAlice = Config.instance(agentAlice, dna)
const scenario = new Scenario([instanceAlice])

/*----------  Events  ----------*/


const testNewEventParams = {
  name: "test new event",
  description: "for testing...",
  initial_members: [],
  public: true
}

const testNewChallengeParams = {
  title: "test new challenge",
  description: "for testing...",
  end_date: "never",
  initial_members: [],
  public: true
}
const testNewIdeaParams = {
  title: "test new idea",
  description: "for testing...",
}
const testMessage = {
  timestamp: 0,
  message_type: "text",
  payload: "I am the message payload",
  meta: "{}",
}


scenario.runTape('Can register a profile and retrieve', async (t, {alice}) => {
  const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
  console.log(register_result)
  t.true(register_result.Ok.includes('alice'))

  const get_profile_result = await alice.callSync('event', 'get_member_profile', {agent_address: register_result.Ok})
  console.log(get_profile_result)
})

scenario.runTape('Can create a public event with no other members and retrieve it', async (t, {alice}) => {
 
  const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
  console.log(register_result)
  t.true(register_result.Ok.includes('alice'))

  const create_result = await alice.callSync('event', 'create_event', testNewEventParams)
  console.log(create_result)
  t.deepEqual(create_result.Ok.length, 46)

  const get_all_members_result = await alice.callSync('event', 'get_members', {event_address: create_result.Ok})
  console.log('all members:', get_all_members_result)
  let allMembers = get_all_members_result.Ok
  t.true(allMembers.length > 0, 'gets at least one member')
  
  const get_result = await alice.callSync('event', 'get_all_public_events', {})
  console.log(get_result)
  t.deepEqual(get_result.Ok.length, 1)

})

scenario.runTape('Can post a message to the event and retrieve', async (t, {alice}) => {

  const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
  console.log(register_result)
  t.true(register_result.Ok.includes('alice'))

  const create_result = await alice.callSync('event', 'create_event', testNewEventParams)
  console.log(create_result)
  const event_addr = create_result.Ok
  t.deepEqual(event_addr.length, 46)

  const get_result = await alice.callSync('event', 'get_all_public_events', {})
  console.log(get_result)
  t.deepEqual(get_result.Ok.length, 1)

  const post_result = await alice.callSync('event', 'post_message', {event_address: event_addr, message: testMessage})
  console.log(post_result)
  t.notEqual(post_result.Ok, undefined, 'post should return Ok')

  const get_message_result = await alice.callSync('event', 'get_messages', {address: event_addr})
  console.log(get_message_result)
  t.deepEqual(get_message_result.Ok[0].entry.payload, testMessage.payload, 'expected to receive the message back')
})

scenario.runTape('Can create a public event with some members that can leave if they want', async (t, {alice}) => {
  try {
  const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
  console.log(register_result)
  t.true(register_result.Ok.includes('alice'))

  const create_result = await alice.callSync('event', 'create_event', {...testNewEventParams, public: false, initial_members: [register_result.Ok]})
  console.log(create_result)
  t.deepEqual(create_result.Ok.length, 46)

  const get_all_members_result = await alice.callSync('event', 'get_members', {event_address: create_result.Ok})
  console.log('all members:', get_all_members_result)
  let allMemberAddrs = get_all_members_result.Ok
  t.true(allMemberAddrs.length > 0, 'gets at least one member')

  const leave_result = await alice.callSync('event', 'leave_event', {event_address: create_result.Ok})
  console.log(leave_result)
  t.deepEqual(create_result.Ok.length, 46)

  const get_all_members_result_post_leaving = await alice.callSync('event', 'get_members', {event_address: create_result.Ok})
  console.log('all members:', get_all_members_result_post_leaving)
  let allMemberAddrsPost = get_all_members_result_post_leaving.Ok
  t.true(allMemberAddrsPost.length == 0, 'has no members!')
  } catch (err) {
    t.fail(err.message);
  }
})

scenario.runTape('Can create a challenge with an idea', async (t, {alice}) => {
  try {
    const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
    console.log(register_result)
    t.true(register_result.Ok.includes('alice'))

    const create_result = await alice.callSync('event', 'create_challenge', {...testNewChallengeParams, initial_members: [register_result.Ok]})
    console.log(create_result)
    t.deepEqual(create_result.Ok.length, 46)

    const create_idea_result = await alice.callSync('event', 'create_idea', {...testNewIdeaParams, challenge_address: create_result.Ok}) 
    console.log(create_idea_result);
    t.deepEqual(create_idea_result.Ok.length, 46)

  } catch (err) {
    t.fail(err.message);
  }
})
scenario.runTape('Can post and retrieve messages to challenges and ideas', async (t, {alice}) => {
  try {
    const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
    console.log(register_result)

    const challenge_address = await alice.callSync('event', 'create_challenge', {...testNewChallengeParams, initial_members: [register_result.Ok]})
    console.log(challenge_address)

    const idea_address = await alice.callSync('event', 'create_idea', {...testNewIdeaParams, challenge_address: challenge_address.Ok}) 
    console.log(idea_address);

    const get_result = await alice.callSync('event', 'get_all_challenges', {})
    console.log(get_result)
    t.deepEqual(get_result.Ok.length, 1)

    const post_result = await alice.callSync('event', 'post_message', {event_address: challenge_address.Ok, message: testMessage})
    console.log(post_result)
    t.notEqual(post_result.Ok, undefined, 'challenge post should return Ok')

    const get_message_result = await alice.callSync('event', 'get_messages', {address: challenge_address.Ok})
    console.log(get_message_result)
    t.deepEqual(get_message_result.Ok[0].entry.payload, testMessage.payload, 'expected to receive the challenge message back')
    
    const idea_post_result = await alice.callSync('event', 'post_message', {event_address: idea_address.Ok, message: testMessage})
    console.log(idea_post_result)
    t.notEqual(idea_post_result.Ok, undefined, 'idea post should return Ok')

    const get_idea_message_result = await alice.callSync('event', 'get_messages', {address: idea_address.Ok})
    console.log(get_idea_message_result)
    t.deepEqual(get_idea_message_result.Ok[0].entry.payload, testMessage.payload, 'expected to receive the idea message back')

  } catch (err) {
    t.fail(err.message);
  }
})

scenario.runTape('Can create an idea that can be liked and unliked', async (t, {alice}) => {
  try {
  const register_result = await alice.callSync('event', 'register', {name: 'alice', avatar_url: ''})
  console.log(register_result)

  const challenge_address = await alice.callSync('event', 'create_challenge', {...testNewChallengeParams, initial_members: [register_result.Ok]})
  console.log(challenge_address)

  const idea_address = await alice.callSync('event', 'create_idea', {...testNewIdeaParams, challenge_address: challenge_address.Ok}) 
  console.log(idea_address);

  const like_result = await alice.callSync('event', 'like_idea', {idea_address: idea_address.Ok})
  console.log(like_result)

  const get_likes_result = await alice.callSync('event', 'get_likes', {idea_address: idea_address.Ok})
  console.log('liked by:', get_likes_result)
  let allMemberAddrs = get_likes_result.Ok
  t.true(allMemberAddrs.length > 0, 'gets at least one like')

  const leave_result = await alice.callSync('event', 'unlike_idea', {idea_address: idea_address.Ok})
  console.log(leave_result)

  const get_likes_result_post_leaving = await alice.callSync('event', 'get_likes', {idea_address: idea_address.Ok})
  console.log('liked by post leaving:', get_likes_result_post_leaving)
  let allMemberAddrsPost = get_likes_result_post_leaving.Ok
  t.true(allMemberAddrsPost.length == 0, 'has no members!')
  } catch (err) {
    t.fail(err.message);
  }
})
