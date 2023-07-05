


export default function ExamBox({exam}:any){

    return(
        <div className="w-full h-full text-white font-serif">
                          <div className="w-full h-full truncate relative rounded-md border-[1px] border-black/20 bg-yellow-40 bg-[#17537a] cursor-pointer">
                              <div className="h-[30%] relative w-full flex justify-center items-end">
                                  <span className="text-white text-[24px] truncate font-semibold font-serif">{exam.title}</span>
                              </div>
                              <div className="w-full flex flex-col truncate">
                              <div className="px-4 flex items-end mt-2">
                                  <div className="p-1 h-10 w-10 border-black/10 rounded-full bg-gradient-to-tr from-fuchsia-700 to-purple-900">
                                      <div className="w-full h-full bg-gray-400 rounded-full"></div>
                                  </div>
                                  <span className=" text-[20px]">Ali Adilovic</span>
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