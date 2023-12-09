import Image from "next/image"


export default function ExamBox({exam}:any){

    return(
        <div className="w-full h-full relative text-white font-serif">
                          <div className={`w-full h-full truncate relative rounded-md border-[1px] border-black/20
                           bg-yellow-40 ${exam.color ? exam.color : 'bg-[#222831]'} cursor-pointer`}>
                              <div className="h-[30%] relative w-full flex justify-center items-end">
                                  <span className="text-white text-[24px] truncate font-semibold font-serif">{exam.title}</span>
                              </div>
                              <div className="w-full flex flex-col truncate">
                              <div className="px-4 hidden lg:flex items-end mt-2">
                                  <div className=" h-10 w-10  rounded-full mr-1">
                                      <div className="w-full h-full relative bg-gray-400 rounded-full">
                                        {exam.creator.image && <Image className="rounded-full" src={exam.creator.image} fill alt=''></Image>}
                                      </div>
                                  </div>
                                  <span className=" text-[20px]">{exam.creator.name}</span>
                              </div>
                              <div className="px-6 flex items-center mt-2">
                                  <span className=" text-[20px]">{exam.membersTotal} Members</span>
                              </div>
                              <div className="px-6 flex items-center mt-2">
                                  <span className="  text-[20px]">{exam.postsTotal} Posts</span>
                              </div>
                              </div>
                            
                          </div>
        </div>
    )
}