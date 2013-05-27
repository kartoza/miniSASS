-- Function: public.raw_sectrack_feeds_trigger()

-- DROP FUNCTION public.raw_sectrack_feeds_trigger();

CREATE OR REPLACE FUNCTION public.score_trigger()
  RETURNS trigger AS
$BODY$
  DECLARE
    count integer := 0;
    total integer := 0;
  BEGIN
     IF NEW.flatworms THEN count := count + 1; total := total + 3; END IF;
     IF NEW.worms THEN count := count + 1; total := total + 2; END IF;
     IF NEW.leeches THEN count := count + 1; total := total + 2; END IF;
     IF NEW.crabs_shrimps THEN count := count + 1; total := total + 6; END IF;
     IF NEW.stoneflies THEN count := count + 1; total := total + 17; END IF;
     IF NEW.minnow_mayflies THEN count := count + 1; total := total + 5; END IF;
     IF NEW.other_mayflies THEN count := count + 1; total := total + 11; END IF;
     IF NEW.damselflies THEN count := count + 1; total := total + 4; END IF;
     IF NEW.dragonflies THEN count := count + 1; total := total + 6; END IF;
     IF NEW.bugs_beetles THEN count := count + 1; total := total + 5; END IF;
     IF NEW.caddisflies THEN count := count + 1; total := total + 9; END IF;
     IF NEW.true_flies THEN count := count + 1; total := total + 2; END IF;
     IF NEW.snails THEN count := count + 1; total := total + 4; END IF;
     NEW.score := total::numeric / count::numeric;
    RETURN NEW;
    EXCEPTION
     WHEN division_by_zero THEN NEW.score := NULL; RETURN NEW;
  END
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION score_trigger()
  OWNER TO minisass;

  -- DROP TRIGGER score_trigger ON public.observations;

CREATE TRIGGER score_trigger
  BEFORE INSERT OR UPDATE OF flatworms,worms,leeches,crabs_shrimps,stoneflies,minnow_mayflies,other_mayflies,
damselflies,dragonflies,bugs_beetles,caddisflies,true_flies,snails
  ON public.observations
  FOR EACH ROW
  EXECUTE PROCEDURE public.score_trigger();

/*tests

select * from observations limit 1;
  
insert into observations (user_id,flatworms,worms,leeches,crabs_shrimps,stoneflies,minnow_mayflies,other_mayflies,
damselflies,dragonflies,bugs_beetles,caddisflies,true_flies,snails) VALUES
('999','f','f','f','f','f','f','f','f','f','f','f','f','f');

select * from observations where user_id = '999';

*/

