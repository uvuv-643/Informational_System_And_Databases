./artisan db:seed cities 500 name=city
./artisan db:seed districts 500 city_id=cities name=district
./artisan db:seed locations 15000 district_id=districts street=word house=house
./artisan db:seed photos 85000 thumb=word photo_path=house
./artisan db:seed users 385000 name=name password=word district_id=districts
./artisan db:seed orders 680000 description=description location_id=locations user_id=users
./artisan db:seed voting_statuses 5 name=word
./artisan db:seed votings 50000 order_id=orders voting_status_id=voting_statuses started_at=timestamp finished_at=null
./artisan db:seed votes 500000 user_id=users voting_id=votings vote=bool created_at=timestamp
./artisan db:seed orders_photos 500000 order_id=orders photo_id=photos
./artisan db:seed job_statuses 5 name=word
./artisan db:seed jobs 50000 order_id=orders job_status_id=job_statuses started_at=timestamp finished_at=null
./artisan db:seed jobs_users 200000 job_id=jobs user_id=users
./artisan db:seed chats 200000 order_id=orders user1_id=users user2_id=users created_at=timestamp
./artisan db:seed chat_messages 20000 chat_id=chats sender_id=users content=description created_at=timestamp
./artisan db:seed roles 5 name=word
./artisan db:seed users_roles 5000 user_id=users role_id=roles



