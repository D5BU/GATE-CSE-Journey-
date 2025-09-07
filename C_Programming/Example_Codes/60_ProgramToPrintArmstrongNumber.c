//An armstrong number is a three digit number in which the sum of cube of all digits is equal to the number
//For example, 371 is an Armstrong number since, 371 = 3^3+7^3+1^3 = 27+ 343+1 = 371
#include<stdio.h>
int main(void)
{
    int num, n , cube, d, sum;
    printf("Armstrong numbers are: \n");
    for(num = 100; num<=999; num++)
    {
        n = num;
        sum = 0;
        while(n>0)
        {
            d=n%10;
            n/=10;
            cube=d*d*d;
            sum = sum+cube;
        }
        if(num==sum)
        printf("%d\n", num);

    }
    return 0;
}