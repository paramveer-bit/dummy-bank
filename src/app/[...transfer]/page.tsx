'use client'

import {  useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast"




export default function Component() {
  const searchParams = useSearchParams();
  const { toast } = useToast()


  const balance  = searchParams.get("amount") || 0
  const [isAdding, setIsAdding] = useState(false)
  const[tries,setTries] = useState(0)

  console.log(searchParams.get("tid"))
  const handleAddAmount = async () => {
    // setTries(1);
    setIsAdding(true)
    const amount = searchParams.get("amount") || 0;
    const uid = searchParams.get("tid") || 0;
    const token = searchParams.get("token") || 0;
    try {
      // const res = await axios.post("http://13.60.167.45:3009/hdfcWebhook",{token:token, user_identifier:Number(uid),amount:Number(amount)})
      const res = await axios.post("http://13.60.167.45:3009/hdfcWebhook",{token:token, user_identifier:Number(uid),amount:Number(amount)})
      const res2 = await axios.get("http://13.60.167.45:3009/hello")
      console.log(res2) 
      // console.log(res)
      console.log(res)
      if(res.data.message==="Invalid token"){
        toast({
          title: 'Invalid Token',
          description: 'Please try again',
          variant : "destructive"
        })
      }
      else if(res.data.message==="Invalid User"){
        toast({
          title: 'Invalid User',
          description: 'Please try again',
          variant : "destructive"
        })
      }
      else if(res.data.message==="Already Captured"){
        toast({
          title: 'This request had been processed already',
          description: 'Please try again',
          variant : "destructive"
        })
      }
      else if(res.data.message==="Captured"){
        toast({
          title: 'Amount Added',
          description: 'Amount has been added to your account',
        })
        setTimeout(()=>{
          window.close()
        },3000)
      }
      // console.log("YEsss")
      setTries(0)
      setIsAdding(false)
    } catch (error) {
      setTries(tries-1)
      console.error(error)
      if(tries==0){
        toast({
          title: 'Error',
          description: 'Please try again',
          variant : "destructive"
        })
        setIsAdding(false)
      }

    }
  }

  useEffect(() => {
    if(tries > 0){
      handleAddAmount()
      setTries(0)
    }
  },[tries])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-[#004C8F] text-white">
          <CardTitle className="text-2xl font-bold">HDFC Bank</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold">
              ₹{balance.toLocaleString('en-IN')}
            </div>
            <div>
              <Button 
                onClick={handleAddAmount} 
                className="bg-[#ED232A] hover:bg-[#D1191F] text-white"
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add Amount'}
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Click to add amount to your balance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}