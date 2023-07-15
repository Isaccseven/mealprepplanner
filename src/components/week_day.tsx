interface Weekday {
    weekdayName: string
}


export default function Weekday({weekdayName}:Weekday){
    return(
        <div className=" text-2xl font-bold bg-gray-300 text-gray-800 m-3 w-1/6 h-10 flex justify-center items-center rounded-md " >
            {weekdayName}
        </div>
    );
}