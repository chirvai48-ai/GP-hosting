import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
async function main() {
    try{
        await auth.api.signUpEmail({
            body:{
                name:"Super Admin",
                email:"superadmin@glowing-partner.com",
                password:"Admin@1234",
            }
        })
    }
catch(error){
    console.log(error);
}
 await prisma.$disconnect()
}

main()