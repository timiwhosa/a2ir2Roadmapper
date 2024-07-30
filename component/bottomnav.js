import Link from "next/link";


export default function ButtonNav(){
    return(
        <div className="bottomNav ">
            <Link href="/">
                <div>
                    Acc
                </div>
            </Link>
            <Link href="/map">
                <div>
                    Map
                </div>
            </Link>
        </div>
    )
}