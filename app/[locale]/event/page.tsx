import Event from '@/components/events/evenement/event';
import Hero from '@/components/events/evenement/hero';
import { prefetchEvenementsListQuery } from '@/features/evenement/queries/evenement-list.query';
export default function event() {
    prefetchEvenementsListQuery({
        page: 1,
        limit: 10,
    })
    return (
        <div>
            <Hero />
            <Event />
        </div>
    );
}