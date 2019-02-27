#![feature(try_from)]
#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;
#[macro_use]
extern crate holochain_core_types_derive;
use hdk::{
    error::ZomeApiResult,
};

use hdk::holochain_core_types::{
    hash::HashString,
    cas::content::Address,
    json::{JsonString},
    error::HolochainError,
};

mod anchor;
mod challenge;
mod event;
mod message;
mod member;
mod utils;
mod idea;

define_zome! {

	entries: [
		anchor::anchor_definition(),
		challenge::challenge_definition(),
		idea::idea_definition(),
    	event::public_event_definition(),
        member::profile_definition(),
		message::message_definition()
	]

    genesis: || {
        {
    		Ok(())
        }
    }

	functions: [
		register: {
			inputs: | name: String, avatar_url: String |,
			outputs: |result: ZomeApiResult<Address>|,
			handler: member::handlers::handle_register
		}
		create_event: {
			inputs: |name: String, description: String, initial_members: Vec<Address>|,
			outputs: |result: ZomeApiResult<Address>|,
			handler: event::handlers::handle_create_event
		}
		create_challenge: {
			inputs: |title: String, description: String, end_date:String, initial_members: Vec<Address>|,
			outputs: |result: ZomeApiResult<Address>|,
			handler: challenge::handlers::handle_create_challenge
		}
		create_idea: {
			inputs: |title: String, description: String, challenge_address: HashString|,
			outputs: |result: ZomeApiResult<Address>|,
			handler: idea::handlers::handle_create_idea
		}
		join_event: {
		    inputs: |event_address: HashString|,
		    outputs: |result: ZomeApiResult<()>|,
		    handler: event::handlers::handle_join_event
		}
		leave_event: {
		    inputs: |event_address: HashString|,
		    outputs: |result: ZomeApiResult<()>|,
		    handler: event::handlers::handle_leave_event
		}
		join_challenge: {
		    inputs: |challenge_address: HashString|,
		    outputs: |result: ZomeApiResult<()>|,
		    handler: challenge::handlers::handle_join_challenge
		}
		like_idea: {
		    inputs: |idea_address: HashString|,
		    outputs: |result: ZomeApiResult<()>|,
		    handler: idea::handlers::handle_like_idea
		}
		unlike_idea: {
		    inputs: |idea_address: HashString|,
		    outputs: |result: ZomeApiResult<()>|,
		    handler: idea::handlers::handle_unlike_idea
		}
		get_likes: {
		    inputs: |idea_address: HashString|,
		    outputs: |result: ZomeApiResult<Vec<Address>>|,
		    handler: idea::handlers::handle_get_likes
		}
		get_all_public_events: {
			inputs: | |,
			outputs: |result: ZomeApiResult<utils::GetLinksLoadResult<event::Event>>|,
			handler: event::handlers::handle_get_all_public_events
		}
		get_all_challenges: {
			inputs: | |,
			outputs: |result: ZomeApiResult<utils::GetLinksLoadResult<challenge::Challenge>>|,
			handler: challenge::handlers::handle_get_all_challenges
		}
		get_all_ideas: {
			inputs: | |,
			outputs: |result: ZomeApiResult<utils::GetLinksLoadResult<idea::Idea>>|,
			handler: idea::handlers::handle_get_all_ideas
		}
		get_ideas: {
			inputs: |challenge_address: HashString |,
			outputs: |result: ZomeApiResult<utils::GetLinksLoadResult<idea::Idea>>|,
			handler: challenge::handlers::handle_get_ideas
		}
		get_members: {
			inputs: |event_address: HashString|,
			outputs: |result: ZomeApiResult<Vec<Address>>|,
			handler: event::handlers::handle_get_members
		}
		get_member_profile: {
			inputs: |agent_address: HashString|,
			outputs: |result: ZomeApiResult<member::Profile>|,
			handler: member::handlers::handle_get_member_profile			
		}
		get_my_member_profile: {
			inputs: | |,
			outputs: |result: ZomeApiResult<member::Profile>|,
			handler: member::handlers::handle_get_my_member_profile			
		}
		post_message: {
			inputs: |event_address: HashString, message: message::MessageSpec|,
			outputs: |result: ZomeApiResult<()>|,
			handler: event::handlers::handle_post_message
		}
		get_messages: {
			inputs: |address: HashString|,
			outputs: |result: ZomeApiResult<utils::GetLinksLoadResult<message::Message>>|,
			handler: event::handlers::handle_get_messages
		}
	]

	 traits: {
	        hc_public [
	        	register,
	        	create_event,
				create_challenge,
				create_idea,
	        	join_event,
				leave_event,
				join_challenge,
				like_idea,
				unlike_idea,
				get_likes,
	        	get_all_public_events,
				get_all_challenges,
				get_all_ideas,
				get_ideas,
	        	get_members,
	        	get_member_profile,
	        	get_my_member_profile,
	        	post_message,
	        	get_messages
	        ]
	}
 }


