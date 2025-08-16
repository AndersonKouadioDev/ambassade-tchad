import Hero from '@/components/events/galerie_videos/hero';
import VideoGallery from '@/features/videos/components';
import { prefetchVideosList } from '@/features/videos/queries/video-list.query';

export default function galeryVideo(){
    const params = {
        page: 1,
        createdAt: '',
        title: '',
        limit: 12,
    };
    
    prefetchVideosList(params);
    return(
    
        <div>
            <Hero/>
            <VideoGallery searchParams={params}/>
        </div>
    
    );
}