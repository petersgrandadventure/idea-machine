
use hdk::error::ZomeApiResult;
use hdk::AGENT_ADDRESS;
use hdk::holochain_core_types::{
    hash::HashString,
    entry::Entry,
    cas::content::Address,
    json::RawString,
};

use crate::challenge::{
    Challenge,
};

use crate::idea;
use crate::utils;
use crate::message;

pub fn handle_create_challenge(
    title: String,
    description: String,
    end_date: String,
    initial_members: Vec<Address>,
) -> ZomeApiResult<Address> {

    let challenge = Challenge{title, description, end_date};

    let entry = Entry::App(
        "challenge".into(),
        challenge.into()
    );

    let challenge_address = hdk::commit_entry(&entry)?;
    utils::link_entries_bidir(&AGENT_ADDRESS, &challenge_address, "member_of", "has_member")?;
    
    for member in initial_members {
        utils::link_entries_bidir(&member, &challenge_address, "member_of", "has_member")?;
    }

    let anchor_entry = Entry::App(
        "anchor".into(),
        RawString::from("challenge").into(),
    );
    let anchor_address = hdk::commit_entry(&anchor_entry)?;
    hdk::link_entries(&anchor_address, &challenge_address, "challenge")?;

    Ok(challenge_address)
}

pub fn handle_join_challenge(challenge_address: HashString) -> ZomeApiResult<()> {
    utils::link_entries_bidir(&AGENT_ADDRESS, &challenge_address, "member_of", "has_member")?;
    Ok(())
}

pub fn handle_get_members(address: HashString) -> ZomeApiResult<Vec<Address>> {
    let all_member_ids = hdk::get_links(&address, "has_member")?.addresses().to_owned();
    Ok(all_member_ids)
}

pub fn handle_get_messages(address: HashString) -> ZomeApiResult<utils::GetLinksLoadResult<message::Message>> {
    utils::get_links_and_load_type(&address, "message_in")
}

pub fn handle_get_ideas(address: HashString) -> ZomeApiResult<utils::GetLinksLoadResult<idea::Idea>> {
    utils::get_links_and_load_type(&address, "ideas_submitted")
}

pub fn handle_post_message(challenge_address: HashString, message_spec: message::MessageSpec) -> ZomeApiResult<()> {

    let message = message::Message::from_spec(
        &message_spec,
        &AGENT_ADDRESS.to_string());

    let message_entry = Entry::App(
        "message".into(),
        message.into(),
    );

    let message_addr = hdk::commit_entry(&message_entry)?;

    hdk::link_entries(&challenge_address, &message_addr, "message_in")?;

    Ok(())
}

pub fn handle_get_all_challenges() -> ZomeApiResult<utils::GetLinksLoadResult<Challenge>> {
    let anchor_entry = Entry::App(
        "anchor".into(),
        RawString::from("challenge").into(),
    );
    let anchor_address = hdk::entry_address(&anchor_entry)?;
    utils::get_links_and_load_type(&anchor_address, "challenge")
}
