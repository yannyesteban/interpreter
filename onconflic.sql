INSERT INTO "user" ("id","user","pass","expire","status") VALUES (1,'pepe 456','123456','2004-06-12',1) 

        ON CONFLICT (id)  DO UPDATE SET id="user".id,"user"=excluded .user ,pass="user".pass,expire="user".expire,status="user".status
		
		RETURNING *;
		
		INSERT INTO "user" ("id","user","pass","expire","status") VALUES (1,'pepe 777','123456','2004-06-12',1)
            ON CONFLICT (id) DO UPDATE SET "id"=EXCLUDED.id,"user"=EXCLUDED.user,"pass"=EXCLUDED.pass,"expire"=EXCLUDED.expire,"status"=EXCLUDED.status RETURNING *;
		
		
		
INSERT INTO "user" ("id","user","pass","expire","status") VALUES (1,'pepe 777','123456','2004-06-12',1)
            ON CONFLICT (id) DO UPDATE SET "id"=EXCLUDED.id,"user"=EXCLUDED.user,"pass"=EXCLUDED.pass,"expire"=EXCLUDED.expire,"status"=EXCLUDED.status RETURNING *;		
			