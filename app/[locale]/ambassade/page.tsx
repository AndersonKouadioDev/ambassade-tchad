import Ambassadeur from "@/components/ambassade/ambassadeur/ambassadeur";
import TeamMember from "@/components/ambassade/experience/experience";
import Hero from "@/components/ambassade/hero/hero";
import President from "@/components/tourisme/president/president";
// import Photo from "@/components/ambassade/photo/photo";


export default function Ambassade(){
    return(
        <div>
            <Hero/>
            <President />
            <Ambassadeur/>
            <TeamMember/>
            {/* <Photo/> */}
        </div>
    );
}