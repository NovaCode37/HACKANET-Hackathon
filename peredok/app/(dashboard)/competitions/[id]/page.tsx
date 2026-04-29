import { mockCompetitionDetail } from "@/lib/mock";
import Link from "next/link";

export default function competitionPage({params} : {params : {id : string}}){
    
    const data = mockCompetitionDetail

    return(
        <div>
            <h1>{data.name} {data.type}</h1>
            <p>{data.performance_count} {data.avg_scrores} {data.execution_accuracy} {data.artistic_accuracy}</p>
            <p>{data.categories.map( (cat) => (<Link key={cat.id} className="block" href={`/competitions/${params.id}/${cat.id}`}>{cat.discipline} {cat.age_category} {cat.execution_accuracy} {cat.artistic_accuracy} {cat.deviation_coefficient} {cat.performance_count}</Link>) )}</p>
            <Link href={"/competitions"}>Назад</Link>
        </div>
    )
}