import React, {Fragment} from 'react';
import EventListItem from './EventListItem';
import InfiniteScroll from 'react-infinite-scroller';

const EventList = ({events, moreEvents, getNextEvents, loading}) =>
    <Fragment>
        {events && events.length !== 0 &&
        <InfiniteScroll
            pageStart={0}
            loadMore={getNextEvents}
            hasMore={!loading && moreEvents}
            initialLoad={false}
        >
            {events && events.map(event => (
                <EventListItem
                    key={event.id}
                    event={event}
                />
            ))}
        </InfiniteScroll>
        }

    </Fragment>;

export default EventList;

