"use client"

import { useState } from "react"
import { mockCompetitions } from "@/lib/mock"
import Link from "next/link"



export default function competitionsList() {
    
    const [query, setQuery] = useState('')


    return (
    query.length == 0 ? 
    <div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Введите название мероприятия" />
        {mockCompetitions.map( (comp) => (<div key={comp.id}><Link href={`/competitions/${comp.id}`}>{comp.name}</Link>{comp.type}{comp.execution_accuracy}{comp.artistic_accuracy}</div>) )}
    </div> : <div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Введите название мероприятия" />
        {mockCompetitions.filter( (comp) => comp.name.toLowerCase().includes(query.toLowerCase())).map( (comp) => (<div key={comp.id}><Link href={`/competitions/${comp.id}`}>{comp.name}</Link>{comp.type}{comp.execution_accuracy}{comp.artistic_accuracy}</div>) )}
    </div>
    )
}
