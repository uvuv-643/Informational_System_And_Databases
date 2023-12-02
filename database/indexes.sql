CREATE INDEX votings_order_id_index ON votings USING btree(order_id);
CREATE INDEX votes_votings_id_index ON votes USING btree(voting_id);
CREATE INDEX orders_user_id_index ON orders USING btree(user_id);
CREATE INDEX jobs_order_id_index ON jobs USING btree(order_id);
CREATE INDEX chats_order_id_index ON chats USING btree(order_id);
CREATE INDEX chats_user1_id_index ON chats USING btree(user1_id);
CREATE INDEX chats_user2_id_index ON chats USING btree(user2_id);
CREATE INDEX chat_messages_chat_id_index ON chat_messages USING btree(chat_id);
CREATE INDEX chat_messages_user_index ON chat_messages USING btree(sender_id);



