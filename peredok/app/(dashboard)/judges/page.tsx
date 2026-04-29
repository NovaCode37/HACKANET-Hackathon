"use client"

import { useState } from "react"
import {  mockJudges } from "@/lib/mock"
import Link from "next/link"



export default function judgesList() {
    
    const [query, setQuery] = useState('')

    const data = mockJudges

    return (
    query.length == 0 ? 
    <div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Введите ФИО судьи" />
        {data.map( (jud) => (<div key={jud.id}><Link href={`/judges/${jud.id}`}>{jud.fio}</Link>{jud.region} {jud.city} {jud.execution_accuracy}{jud.artistic_accuracy} {jud.bias_coefficient}</div>) )}
    </div> : <div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Введите ФИО судьи" />
        {data.filter( (jud) => jud.fio.toLowerCase().includes(query.toLowerCase())).map( (jud) => (<div key={jud.id}><Link href={`/judges/${jud.id}`}>{jud.fio}</Link>{jud.region} {jud.city} {jud.execution_accuracy}{jud.artistic_accuracy} {jud.bias_coefficient}</div>) )}
    </div>
    )
}