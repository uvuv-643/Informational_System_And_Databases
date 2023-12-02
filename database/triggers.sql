create or replace trigger check_user_has_access_to_chat
    before insert on chat_messages
    for each row
execute function check_user_has_access_to_chat_handle();

create or replace trigger check_vote_after_finishing
    before insert on votes
    for each row
execute function check_vote_after_finishing_handle();

create or replace trigger check_user_who_make_vote_for_district
    before insert on votes
    for each row
execute function check_user_who_make_vote_for_district_handle();

create or replace trigger create_job_after_finishing_voting
    after update on votings
    for each row
execute function create_job_after_finishing_voting_handle();